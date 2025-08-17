import { getGlobalSetting } from '../../../utils/global-config-helper';
import { formHasSearchWords } from '../../../../../utils/checks';

const FORM_FILTER_NAMES = {
  EXCLUDE_TECHNICAL_FORMS: 'excludeTechnicalForms',
};

const FORM_FILTERS = {
  [FORM_FILTER_NAMES.EXCLUDE_TECHNICAL_FORMS]: (form) => {
    const hasSearchWords = formHasSearchWords(form, getGlobalSetting('hideTasksInOrder.searchWords'));
    return !hasSearchWords;
  },
};

export { FORM_FILTER_NAMES, FORM_FILTERS };
