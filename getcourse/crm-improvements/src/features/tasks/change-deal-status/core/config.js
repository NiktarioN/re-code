import { FORM_FILTER_NAMES } from "../../common/forms-filters";

const CONFIG = {
  FEATURE_NAME: 'Изменение статуса заказа через задачу',
  FEATURE_NAME_ID: 'change-deal-status',

  SETTINGS_PATH: 'tasks.changeDealStatus',

  FORM_FILTER: FORM_FILTER_NAMES.EXCLUDE_TECHNICAL_FORMS,

  SELECTORS: {
    CHANGE_STATUS: '[name="ChangeStatusOperation[status]"]',
  },
};

export default CONFIG;