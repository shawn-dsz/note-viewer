import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['bin/cli.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'bin',
  clean: false,
  shims: true,
  banner: { js: '#!/usr/bin/env node' },
  external: ['vite'],
})
