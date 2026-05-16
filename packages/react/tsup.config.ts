import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'index.ts',
    'jsx-runtime.ts',
    'jsx-dev-runtime.ts'
  ],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  target: 'esnext'
})