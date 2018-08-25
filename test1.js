let logger = function (params) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('xxx');
    }, 3000);
  })
}
async function a(params) {
  for (let i = 0; i < 3; i++) {
    let xxx = await logger();
    console.log(xxx);
  }
}
a();