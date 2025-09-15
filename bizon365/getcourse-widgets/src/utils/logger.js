export const log = (message, ...args) => {
  console.log(`[RE-CODE] ${message}`, ...args);
};

export const error = (message, ...args) => {
  console.error(`[RE-CODE] ${message}`, ...args);
};

export const warn = (message, ...args) => {
  console.warn(`[RE-CODE] ${message}`, ...args);
};
