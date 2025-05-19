// src/observers/lodgeStatusObserver.js

const observers = [];

const lodgeStatusObserver = {
  subscribe: (fn) => {
    observers.push(fn);
  },
  unsubscribe: (fn) => {
    const index = observers.indexOf(fn);
    if (index > -1) {
      observers.splice(index, 1);
    }
  },
  notify: () => {
    observers.forEach((fn) => fn());
  },
};

export default lodgeStatusObserver;
