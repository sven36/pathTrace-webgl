import typescript from '@rollup/plugin-typescript';
import replace from 'rollup-plugin-replace';
const isProduction = process.env.NODE_ENV === 'production';
export default {
  input: 'engine/index.ts', // 输入文件
  output: {
    file: 'dist/bundle.js', // 输出文件
    format: 'cjs', // 输出格式
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(isProduction? 'production' : 'development'),
      '_ISDEBUG_': JSON.stringify(isProduction? 'production' : 'development'),
      '_BUILD3D_': true
    }),
    typescript({
      // 你可以在这里传递TypeScript编译器的选项
    }),
  ],
};