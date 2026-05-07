import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'

export default defineConfig(() => {
  return {
    base: './',
    build: {
      outDir: 'build',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return

            if (id.includes('react-dom') || id.includes('/react/') || id.includes('react-router')) {
              return 'vendor-react'
            }
            if (id.includes('@coreui')) {
              return 'vendor-coreui'
            }
            if (id.includes('chart.js') || id.includes('chartjs') || id.includes('react-chartjs')) {
              return 'vendor-charts'
            }
            if (id.includes('html5-qrcode') || id.includes('qrcode') || id.includes('react-barcode')) {
              return 'vendor-qr'
            }
            if (id.includes('html2canvas') || id.includes('react-to-print')) {
              return 'vendor-print'
            }
            if (id.includes('@tanstack')) {
              return 'vendor-tanstack'
            }
            if (id.includes('redux') || id.includes('zustand')) {
              return 'vendor-state'
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons'
            }
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['legacy-js-api'],
        },
      },
      postcss: {
        plugins: [
          autoprefixer({}), // add options if needed
        ],
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: 'src/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    server: {
      port: 3000,
      proxy: {
        // https://vitejs.dev/config/server-options.html
      },
    },
    cacheDir: './.vite_cache',
  }
})
