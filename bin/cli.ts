/**
 * note-viewer CLI
 * Commands: init, dev, build, preview
 */

import { Command } from 'commander'
import { createServer, build, preview } from 'vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Find the package root (where package.json is)
function findPackageRoot(): string {
  let dir = __dirname
  while (dir !== '/') {
    if (fs.existsSync(path.join(dir, 'package.json'))) {
      return dir
    }
    dir = path.dirname(dir)
  }
  return process.cwd()
}

const packageRoot = findPackageRoot()
const packageJson = JSON.parse(
  fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf-8')
)

// Set environment variable for config directory so vite.config.ts can find user's config
// This must be set before any vite functions are called
process.env.NOTE_VIEWER_CONFIG_DIR = process.cwd()

const program = new Command()

program
  .name('note-viewer')
  .description('A static markdown documentation viewer')
  .version(packageJson.version || '1.0.0')

/**
 * Init command - create a config template
 */
program
  .command('init')
  .description('Initialize a note-viewer configuration file')
  .option('-f, --force', 'Overwrite existing config file')
  .action(async (options) => {
    const configPath = path.resolve(process.cwd(), 'note-viewer.config.ts')

    if (fs.existsSync(configPath) && !options.force) {
      console.error('Config file already exists. Use --force to overwrite.')
      process.exit(1)
    }

    const templatePath = path.join(packageRoot, 'templates', 'note-viewer.config.ts')

    if (fs.existsSync(templatePath)) {
      fs.copyFileSync(templatePath, configPath)
    } else {
      // Fallback: create inline template
      const template = `/**
 * note-viewer configuration
 * @see https://github.com/note-viewer/note-viewer
 */
export default {
  // Directory containing your markdown files
  contentDir: '.',

  // File patterns to include
  patterns: ['**/*.md'],

  // Directories to ignore
  ignore: ['node_modules', 'dist', '.git'],

  // Site metadata
  site: {
    title: 'My Notes',
    description: 'Personal knowledge base',
    icon: '📓',
  },

  // Feature toggles
  features: {
    calculators: false,  // Enable calculator widgets
    tagSidebar: true,    // Enable tag search sidebar
    darkMode: true,      // Enable dark mode toggle
    search: true,        // Enable search (coming soon)
  },

  // Category configuration (optional)
  // categories: {
  //   'my-category': {
  //     label: 'My Category',
  //     emoji: '📁',
  //     description: 'Description of this category',
  //   }
  // },

  // Tag definitions (optional)
  // tags: {
  //   'important': { name: 'Important', bg: '#FFE5D9', text: '#9C6644' },
  // },

  // Auto-tag detection rules (optional)
  // tagRules: [
  //   { tag: 'important', keywords: ['urgent', 'critical', 'important'] },
  // ],
}
`
      fs.writeFileSync(configPath, template)
    }

    console.log('Created note-viewer.config.ts')
    console.log('\nNext steps:')
    console.log('  1. Edit the config file to match your needs')
    console.log('  2. Run: npx note-viewer dev')
  })

/**
 * Dev command - start development server
 */
program
  .command('dev')
  .description('Start the development server')
  .option('-p, --port <port>', 'Port to run on', '5173')
  .option('-h, --host', 'Expose to network')
  .action(async (options) => {
    console.log('Starting note-viewer development server...')

    // Run the catalog generator first
    await runCatalogGenerator()

    const server = await createServer({
      root: packageRoot,
      server: {
        port: parseInt(options.port, 10),
        host: options.host ? true : 'localhost',
      },
      // Don't specify plugins here - vite.config.ts already has them
    })

    await server.listen()
    server.printUrls()
  })

/**
 * Build command - create production build
 */
program
  .command('build')
  .description('Build for production')
  .option('-o, --outDir <dir>', 'Output directory', 'dist')
  .action(async (options) => {
    console.log('Building note-viewer for production...')

    // Run the catalog generator first
    await runCatalogGenerator()

    await build({
      root: packageRoot,
      build: {
        outDir: path.resolve(process.cwd(), options.outDir),
      },
      // Don't specify plugins here - vite.config.ts already has them
    })

    console.log(`\nBuild complete! Output: ${options.outDir}`)
  })

/**
 * Preview command - preview production build (auto-builds if needed)
 */
program
  .command('preview')
  .description('Preview the production build')
  .option('-p, --port <port>', 'Port to run on', '4173')
  .action(async (options) => {
    const distPath = path.resolve(process.cwd(), 'dist')

    // Check if catalog needs regeneration
    const catalogPath = path.join(packageRoot, 'src/data/docs-generated.ts')
    const catalogNeedsUpdate = await isCatalogStale(catalogPath)

    if (catalogNeedsUpdate || !fs.existsSync(distPath)) {
      console.log('Building for preview...')

      // Regenerate catalog
      await runCatalogGenerator()

      // Run production build
      await build({
        root: packageRoot,
        build: {
          outDir: distPath,
        },
      })

      console.log('Build complete!\n')
    }

    console.log('Starting preview server...')

    const server = await preview({
      root: packageRoot,
      preview: {
        port: parseInt(options.port, 10),
      },
      build: {
        outDir: distPath,
      },
    })

    server.printUrls()
  })

/**
 * Check if the catalog is stale (needs regeneration)
 * Compares catalog mtime against config and markdown files
 */
async function isCatalogStale(catalogPath: string): Promise<boolean> {
  // If catalog doesn't exist, it's stale
  if (!fs.existsSync(catalogPath)) {
    return true
  }

  const catalogMtime = fs.statSync(catalogPath).mtimeMs

  // Check config file
  const configPath = path.resolve(process.cwd(), 'note-viewer.config.ts')
  if (fs.existsSync(configPath)) {
    if (fs.statSync(configPath).mtimeMs > catalogMtime) {
      return true
    }
  }

  // Check markdown files in current directory
  const hasNewerMd = await checkForNewerFiles(process.cwd(), catalogMtime, ['.md'])
  return hasNewerMd
}

/**
 * Recursively check if any files with given extensions are newer than reference time
 */
async function checkForNewerFiles(
  dir: string,
  referenceTime: number,
  extensions: string[]
): Promise<boolean> {
  const ignoreDirs = new Set(['node_modules', '.git', 'dist', 'build'])

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (!ignoreDirs.has(entry.name)) {
        if (await checkForNewerFiles(fullPath, referenceTime, extensions)) {
          return true
        }
      }
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      if (fs.statSync(fullPath).mtimeMs > referenceTime) {
        return true
      }
    }
  }
  return false
}

/**
 * Run the catalog generator script
 */
async function runCatalogGenerator(): Promise<void> {
  const { spawn } = await import('child_process')

  return new Promise((resolve, reject) => {
    const scriptPath = path.join(packageRoot, 'scripts', 'generate-docs-catalog.ts')
    const tsxBin = path.join(packageRoot, 'node_modules', '.bin', 'tsx')
    const child = spawn(tsxBin, [scriptPath], {
      cwd: packageRoot,  // Run from package root so output goes to right place
      stdio: 'inherit',
      env: {
        ...process.env,
        NOTE_VIEWER_CONFIG_DIR: process.cwd(),  // Pass user's directory via env
        // Add package root to NODE_PATH so user config can import 'note-viewer'
        NODE_PATH: [
          path.join(packageRoot, 'node_modules'),
          process.env.NODE_PATH
        ].filter(Boolean).join(path.delimiter),
      },
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Catalog generation failed with code ${code}`))
      }
    })

    child.on('error', reject)
  })
}

program.parse()
