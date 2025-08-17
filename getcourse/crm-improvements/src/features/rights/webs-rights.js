import settings from '../../config/default-settings';
import { isEmployee, isTargetUserId } from '../../../../utils/checks';
import { isNotEmptyArray, checkTargetPage } from '../../../../../utils/checks';
import { isOneWebRoomPage, isOneWebSettingsPage, isWebsListPage } from '../../../../utils/page-checker';

const isValidConfig = (idList, notMode) => isNotEmptyArray(idList) && typeof notMode === 'boolean';

const websRights = (config) => {
  const {
    idList = [],
    notMode = settings.websRights.notMode,
    notAccessRedirectUrl = settings.websRights.notAccessRedirectUrl,
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

  const isTargetPage = checkTargetPage([isOneWebRoomPage, isOneWebSettingsPage, isWebsListPage]);
  if (!isTargetPage) {
    return;
  }

  document.body.classList.add('recode-webs-rights');

  if (isWebsListPage) {
    document.querySelector('.standard-page-actions')?.remove();
  }

  if (isOneWebRoomPage) {
    document.querySelector('.controls-buttons.webinar-controls')?.remove();
    document.querySelector('.page-header')?.remove();

    document.querySelector('.main .webinar-menu')?.remove();
    document.querySelector('.main .two-panel')?.remove();
    document.querySelector('.main .three-panel')?.remove();
  }

  if (isOneWebSettingsPage) {
    document.body.classList.add('recode-not-access');

    window.location.href = notAccessRedirectUrl;
  }
};

export default websRights;
