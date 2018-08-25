// 观察者模式
class Observer{
  constructor(){
    this.arr = [];
    this.val = 1; // 等待这个值更新时 触发被观察者的更新方法
  }
  updateVal(){
    this.val = 100;
    this.arr.forEach(s=>s.update());
  }
  save(s){
    this.arr.push(s);
  }
}
// 被观察者，被观察者有一个更新的方法
class Subject{
  update(){
    console.log('update');
  }
}
let s = new Subject(); // 一个个小的被观察者
let observe = new Observer();
observe.save(s);
observe.save(s);
observe.updateVal(); // 当值发生变化后 会自动触发