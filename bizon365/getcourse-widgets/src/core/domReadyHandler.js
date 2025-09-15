const DOM_READY_STATES = ['interactive', 'complete'];

export const waitForDOMReady = () =>
  new Promise((resolve) => {
    if (DOM_READY_STATES.includes(document.readyState)) {
      resolve();
      return;
    }

    const handleDOMContentLoaded = () => {
      document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
      resolve();
    };

    document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
  });