/*
* index.js: webpack入口起点文件
* 1. 运行指令：
*       1.1 开发环境： webpack ./src/index.js -o ./build/build.js --mode=development
*                     webpack会以./src/index.js为入口源文件，打包后输出到./build/build.js, 整体进行打包，是开发环境
*       1.2 生产环境
* */
import data from '../other/data';
import '../scss/index.scss';
import '../fonts/iconfont.css';
function f() {
    console.log('f')
}
f();
console.log(data);
