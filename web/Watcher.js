class Dep {

}
Dep.targetStack = [];
export function pushTarget (t) {
  if(Dep.target){
    Dep.targetStack.push(Dep.target);
  }
  Dep.target = t;
}
export function popTarget (){
  Dep.target = Dep.targetStack.pop();
}

export default class Watcher {

  constructor(instance,key){
    let w = this;
    const data = instance[key];

    this.instance = instance;
    this.key = key;
    this.parents = new Set();
    this.subs = [];

    // 普通
    if(typeof data !== 'function'){

      this.value = data;
      this.oldValue = data;

      Object.defineProperty(instance,key,{
        set(v){

          w.oldValue = w.value;
          w.value = v;

          w.notify();
        },
        get(){
          if(Dep.target){
            w.parents.add(Dep.target);
          }
          return w.value;
        }
      });

    }else{
      // 计算
      Object.defineProperty(instance,key,{
        set(v){
        },
        get(){
          pushTarget(w);
          w.value = data.call(instance);
          popTarget();
          return w.value;
        }
      });

      this.value = instance[key];
      this.oldValue = this.value;
    }

    if(!instance.$watchs){
        instance.$watchs = {};
    }
    instance.$watchs[key] = this;
  }

  on(fn){
    this.subs.push(fn);
    return () => {
      this.subs = this.subs.filter(f=>{
        return f !== fn;
      })
    }
  }
  off(fn){
    this.subs = this.subs.filter(f=>{
      return f !== fn;
    })
  }

  notify(){
    this.value = this.instance[this.key];

    this.subs.forEach(fn=>{
      fn.call(this.instance,this.value,this.oldValue, () => {
        this.off(fn);
      });
    });
    this.parents.forEach(watchObj=>{
      watchObj.notify();
    })
  }
}
