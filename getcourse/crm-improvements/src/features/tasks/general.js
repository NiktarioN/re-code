import hideDelayBtn from './hide-delay-btn';
import hideTrash from './hide-trash';
import quickDelay from './quick-delay';
import disableResultButtons from './disable-result-buttons';
import addComment from './add-comment';

import TASKS_ENHANCEMENTS_MANAGER from './common/forms-manager';
import initBlockStatusChange from './change-deal-status';
import initTaskOrderValidation from './create-deal';

const initAllTasksFormsEnhancements = (forms) => {
  initBlockStatusChange();
  initTaskOrderValidation();
  TASKS_ENHANCEMENTS_MANAGER.init(forms);
};

export { hideDelayBtn, hideTrash, quickDelay, disableResultButtons, addComment, initAllTasksFormsEnhancements };