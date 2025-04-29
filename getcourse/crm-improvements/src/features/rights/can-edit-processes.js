import settings from '../../config/settings';
import { isEmployee, isTargetUserId } from '../../../../utils/checks';
import { isNotEmptyArray } from '../../../../../utils/checks';
import { isProcessesEditorPage, isProcessEditorPage } from '../../../../utils/page-checker';

const isValidConfig = (idList, notMode) => isNotEmptyArray(idList) && typeof notMode === 'boolean';

const canEditProcesses = (config) => {
  const {
    idList = settings.canEditProcesses.idList,
    notMode = settings.canEditProcesses.notMode,
    notAccessRedirectUrl = settings.canEditProcesses.notAccessRedirectUrl,
  } = config;

  if (!isEmployee) {
    return;
  }

  if (!isValidConfig(idList, notMode)) {
    return;
  }

  const havePermission = notMode ? !isTargetUserId(idList) : isTargetUserId(idList);
  if (havePermission && !window.isSublogined) {
    return;
  }

  if (isProcessesEditorPage || isProcessEditorPage) {
    document.body.classList.add('recode-not-access');
    document.querySelector('.form-group.buttons')?.classList.add('hide');
    document.querySelector('.not-own-process-message')?.classList.add('hide');

    window.location.href = notAccessRedirectUrl;
  }
};

export default canEditProcesses;