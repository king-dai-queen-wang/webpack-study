// 用了core-js按需加载就不用@babel/polyfill全部加载
// import '@babel/polyfill';

//  下一行不进行eslint检查
//  eslint-disable-next-line
const add = () => {
  console.log('sss');
};
add();
const promise = new Promise((resolve) => {
  setTimeout(() => {
    console.log('定时器执行完了');
    resolve();
  }, 1000);
});
console.log(promise);
