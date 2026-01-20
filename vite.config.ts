import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { loadConfig, getContentDir } from './src/config.js'

// Load configuration to get content directory
// Allow override via environment variable for CLI usage
const configDir = process.env.NOTE_VIEWER_CONFIG_DIR || process.cwd()
let contentDir: string
try {
  const config = await loadConfig(path.resolve(configDir, 'note-viewer.config.ts'))
  contentDir = getContentDir(config, path.resolve(configDir, 'note-viewer.config.ts'))
  console.log(`Vite: Using content directory: ${contentDir}`)
} catch (error) {
  console.warn('Vite: Could not load config, using parent directory')
  contentDir = path.resolve(configDir, '..')
}

/**
 * Generate the documentation catalog
 */
function generateCatalog() {
  try {
    // Use direct path to tsx binary for reliable execution when globally installed
    const tsxBin = path.join(__dirname, 'node_modules', '.bin', 'tsx')
    execSync(`"${tsxBin}" scripts/generate-docs-catalog.ts`, {
      cwd: __dirname,
      stdio: 'inherit',
      env: {
        ...process.env,
        NOTE_VIEWER_CONFIG_DIR: configDir,
      },
    })
  } catch (error) {
    console.error('Failed to generate catalog:', error)
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'generate-docs-catalog',
      buildStart() {
        generateCatalog()
      },
      configureServer(server) {
        // Generate catalog on server start
        generateCatalog()

        // Watch for markdown file changes in configured content directory
        const markdownWatcher = server.watcher
        markdownWatcher.add(path.resolve(contentDir, '**/*.md'))

        markdownWatcher.on('add', (filePath) => {
          if (filePath.endsWith('.md')) {
            console.log(`\n📄 New markdown file detected: ${path.relative(contentDir, filePath)}`)
            generateCatalog()

            // Trigger HMR for the catalog module
            const modulePath = path.resolve(__dirname, 'src/data/docs-generated.ts')
            server.moduleGraph.invalidateModule(modulePath)
            server.ws.send({
              type: 'full-reload',
            })
          }
        })

        markdownWatcher.on('change', (filePath) => {
          if (filePath.endsWith('.md')) {
            console.log(`\n✏️  Markdown file modified: ${path.relative(contentDir, filePath)}`)
            generateCatalog()

            // Trigger HMR for the catalog module
            const modulePath = path.resolve(__dirname, 'src/data/docs-generated.ts')
            server.moduleGraph.invalidateModule(modulePath)
            server.ws.send({
              type: 'full-reload',
            })
          }
        })

        markdownWatcher.on('unlink', (filePath) => {
          if (filePath.endsWith('.md')) {
            console.log(`\n🗑️  Markdown file removed: ${path.relative(contentDir, filePath)}`)
            generateCatalog()

            // Trigger HMR for the catalog module
            const modulePath = path.resolve(__dirname, 'src/data/docs-generated.ts')
            server.moduleGraph.invalidateModule(modulePath)
            server.ws.send({
              type: 'full-reload',
            })
          }
        })
      },
    },
    {
      name: 'markdown-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || ''
          const urlPath = url.split('?')[0] // Remove query string
          if (urlPath.endsWith('.md')) {
            const filePath = path.resolve(contentDir, urlPath.slice(1))
            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
              return fs.createReadStream(filePath).pipe(res)
            }
          }
          next()
        })
      },
    },
    {
      name: 'copy-markdown',
      closeBundle() {
        const ignoreDirs = new Set(['node_modules', '.git', 'dist', 'build', '.specify', 'venv', '.venv', 'notes-viewer'])

        const copyDir = (src: string, dest: string) => {
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true })
          }
          const entries = fs.readdirSync(src, { withFileTypes: true })
          for (const entry of entries) {
            const srcPath = path.resolve(src, entry.name)
            const destPath = path.resolve(dest, entry.name)
            if (entry.isDirectory()) {
              // Skip ignored directories
              if (!ignoreDirs.has(entry.name)) {
                copyDir(srcPath, destPath)
              }
            } else if (entry.name.endsWith('.md')) {
              fs.copyFileSync(srcPath, destPath)
            }
          }
        }

        // Copy markdown files from content directory to dist
        const distDir = path.resolve(__dirname, 'dist')
        copyDir(contentDir, distDir)
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  optimizeDeps: {
    exclude: ['fuse.js'],
  },
})
