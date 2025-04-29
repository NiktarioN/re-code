const createElementWithClass = (tag, className, innerHTML = '') => {
  const element = document.createElement(tag);
  element.className = className;
  element.innerHTML = innerHTML;

  return element;
};

const waitForElement = (selector, timeout = 5000) =>
  new Promise((resolve, reject) => {
    const observer = new MutationObserver((mutations, observerInstance) => {
      const element = document.querySelector(selector);
      if (element) {
        observerInstance.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Элемент с селектором "${selector}" не найден в течение ${timeout} мс.`));
    }, timeout);
  });

const createElement = (tag, props = {}) => {
  const element = document.createElement(tag);

  Object.entries(props).forEach(([key, value]) => {
    if (key === 'class') {
      element.className = value;
    } else if (key === 'textContent') {
      element.textContent = value;
    } else if (key === 'html') {
      element.innerHTML = value;
    } else {
      element.setAttribute(key, value);
    }
  });
  return element;
};

export { createElementWithClass, waitForElement, createElement };