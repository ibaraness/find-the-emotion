import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-root-htaccess',
      closeBundle() {
        const src = path.resolve(__dirname, '.htaccess')
        const dest = path.resolve(__dirname, 'dist', '.htaccess')
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest)
        }
      },
    },
  ],
  base: '/find-the-emotion/app/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
