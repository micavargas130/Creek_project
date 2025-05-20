// observers/tentStatusObserver.js
class TentStatusObserver {
    constructor() {
      this.subscribers = [];
    }
  
    subscribe(fn) {
      this.subscribers.push(fn);
    }
  
    unsubscribe(fn) {
      this.subscribers = this.subscribers.filter((sub) => sub !== fn);
    }
  
    notify() {
      this.subscribers.forEach((fn) => fn());
    }
  }
  
  const tentStatusObserver = new TentStatusObserver();
  export default tentStatusObserver;
  