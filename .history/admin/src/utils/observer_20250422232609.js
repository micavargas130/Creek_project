// observer.js
const observers = {};

export const subscribe = (event, callback) => {
  if (!observers[event]) observers[event] = [];
  observers[event].push(callback);
};

export const notify = (event, data) => {
  if (!observers[event]) return;
  observers[event].forEach(callback => callback(data));
};
