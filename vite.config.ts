import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/BarcodeMG/',
  root: '.', // Корень проекта
  publicDir: 'public', // Папка со статическими файлами
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: './public/index.html' // Явно указываем путь к index.html
    }
  }
})