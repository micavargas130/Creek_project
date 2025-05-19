// observer.js
const observers = {};

class EventObserver {
  constructor() {
    this.events = {};
  }

  subscribe(eventName, fn) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(fn);
  }

  unsubscribe(eventName, fn) {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName].filter((f) => f !== fn);
  }

  notify(eventName, data) {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach((fn) => fn(data));
  }
}

const globalObserver = new EventObserver();
export default globalObserver;