function Promise(executor) {
  let self = this;
  self.status = 'pending';
  self.value = undefined;
  self.reason = undefined;
  self.onResolved = [];
  self.onRejected = [];
  function resolve(value) {
    if (self.status === 'pending') {
      self.value = value;
      self.status = 'resolved';
      self.onResolved.forEach(fn => fn());
    }
  }
  function reject(reason) {
    if (self.status === 'pending') {
      self.reason = reason;
      self.status = 'rejected';
      self.onRejected.forEach(fn => fn());
    }
  }
  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}
function resolvePromise(promise2, x, resolve, reject) {
  if(promise2 === x){
    return reject(new TypeError('循环引用'));
  }
  // 这个方法是处理所有promise的实现
  if(x!= null &&(typeof x === 'object' || typeof x=== 'function')){
    try {
      let then = x.then; // {then:{}}
      if(typeof then === 'function'){ // 姑且的认为他是promise
        // 让返回的这个x 也就是返回的promise执行用他的状态让promise2成功或者失败
        then.call(x,(y)=>{
          resolve(y)
        },(e)=>{
          reject(e);
        })
      }else{
        resolve(x);
      }
    } catch (e) {
      reject(e);
    }
  }else{ // x就是一个普通值 (就用这个值让返回的promise成功即可)
    resolve(x);
  }
}
Promise.prototype.then = function (onfulfilled, onrejected) {
  let self = this;
  // 需要判断onfulfilled/onrejected执行的结果和promise2的关系
  // 
  let promise2 = new Promise((resolve, reject) => {
    if (self.status === 'resolved') {
      let x = onfulfilled(self.value);
      resolvePromise(promise2, x, resolve, reject); // 解析x 和 promise2的关系
    }
    if (self.status === 'rejected') {
      let x = onrejected(self.reason);
      resolvePromise(promise2, x, resolve, reject); // 解析x 和 promise2的关系
    }
    if (self.status === 'pending') {
      self.onResolved.push(function () {
        let x = onfulfilled(self.value);
        resolvePromise(promise2, x, resolve, reject); // 解析x 和 promise2的关系
      });
      self.onRejected.push(function () {
        let x = onrejected(self.reason);
        resolvePromise(promise2, x, resolve, reject); // 解析x 和 promise2的关系
      });
    }
  })
  return promise2;
}
module.exports = Promise


