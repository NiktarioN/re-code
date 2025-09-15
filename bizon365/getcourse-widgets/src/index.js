import { recodeInitWidget, recodeInitTabWidget, recodeInitAutoWidget } from './api/api';
import { waitForDOMReady } from './core/domReadyHandler';

const createDOMReadyWrapper = (initFunction) => async (config) => {
  await waitForDOMReady();
  return initFunction(config);
};

window.recodeInitWidget = createDOMReadyWrapper(recodeInitWidget);
window.recodeInitTabWidget = createDOMReadyWrapper(recodeInitTabWidget);
window.recodeInitAutoWidget = createDOMReadyWrapper(recodeInitAutoWidget);
