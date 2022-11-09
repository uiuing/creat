import typescript from '@rollup/plugin-typescript'
import { uglify } from 'rollup-plugin-uglify'

import pkg from './package.json'

export default {
  input: `./src/index.ts`,
  output: [
    {
      file: pkg.main,
      exports: 'named',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    },
    {
      file: 'build/creat-loader.global.js',
      name: 'CreatLoader',
      format: 'iife',
      sourcemap: true
    }
  ],
  plugins: [typescript(), uglify()],
  external: ['eventemitter3']
}
