import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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
}))
