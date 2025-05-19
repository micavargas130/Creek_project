// observer.js
const observers = {};

export const subscribe = (event, callback) => {
  if (!observers[event]) observers[event] = [];
  observers[event].push(callback);
};

export const notify = async (event, data) => {
  if (!observers[event]) return;
  await Promise.all(observers[event].map(callback => callback(data)));
};
