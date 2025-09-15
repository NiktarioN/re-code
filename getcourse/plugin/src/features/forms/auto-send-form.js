import { currentUrl, hasSearchParam } from '../../../../../utils/url-utils';

const CONFIG = {
  SEARCH_PARAMS: ['autosendform', 'auto-send-form', 'auto_send_form'],
};

const autoSendForm = () => {
  const hasSendFormParam = CONFIG.SEARCH_PARAMS.some((param) => hasSearchParam(currentUrl.href, param));
  console.log(hasSendFormParam);
  if (!hasSendFormParam) {
    return;
  }

  const form = document.querySelector('form.lt-form');
  const button = form.querySelector('button[type="submit"]');
  if (!form || !button) {
    return;
  }

  button.click();
};

export default autoSendForm;