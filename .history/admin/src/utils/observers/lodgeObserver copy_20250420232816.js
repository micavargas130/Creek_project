// src/observers/accountingObserver.js

class AccountingObserver {
    constructor() {
      this.subscribers = [];
    }
  
    subscribe(fn) {
      this.subscribers.push(fn);
    }
  
    unsubscribe(fn) {
      this.subscribers = this.subscribers.filter(sub => sub !== fn);
    }
  
    notify(data) {
      this.subscribers.forEach(sub => sub(data));
    }
  }
  
  const accountingObserver = new AccountingObserver();
  export default accountingObserver;
  