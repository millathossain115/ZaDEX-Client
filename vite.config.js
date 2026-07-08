import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

const stripConsolePlugin = () => ({
  name: 'strip-console-production',
  apply: 'build',
  enforce: 'post',
  renderChunk(code) {
    return transformWithEsbuild(code, undefined, {
      drop: ['console', 'debugger'],
      loader: 'js',
    })
  },
})

const productionConsoleGuardPlugin = () => ({
  name: 'production-console-guard',
  apply: 'build',
  transformIndexHtml(html) {
    const guard = `<script>(()=>{const noop=()=>{};['log','debug','info','warn','error','trace','table','group','groupCollapsed','groupEnd','time','timeEnd','timeLog','dir','dirxml','count','countReset','assert','clear'].forEach((method)=>{console[method]=noop})})();</script>`

    return html.replace('<head>', `<head>\n    ${guard}`)
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    mode === 'production' && stripConsolePlugin(),
    mode === 'production' && productionConsoleGuardPlugin(),
  ].filter(Boolean),
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/app': fileURLToPath(new URL('./src/app', import.meta.url)),
      '@/features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@/shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@/assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
    },
  },
}))
