import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

// realpathSync.native returns the on-disk casing of the path (e.g. "E:" not "e:").
// On Windows a lowercase drive letter makes the bundler see the same file under two
// paths, which loads React / React Router twice and breaks hooks at runtime.
const src = fs.realpathSync.native(path.resolve(import.meta.dirname, './src'))

// base './' lets the built site work under any GitHub Pages repo name
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': src } },
})
