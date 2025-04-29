import settings from '../../config/settings';
import { isEmployee, isTargetUserId } from '../../../../utils/checks';
import { isNotEmptyArray } from '../../../../../utils/checks';
import { isOrdersListAndOthers } from '../../../../utils/page-checker';

const isValidConfig = (idList, notMode) => isNotEmptyArray(idList) && typeof notMode === 'boolean';

const canSeeOrdersPage = (config) => {
  const {
    idList = settings.canSeeOrdersPage.idList,
    notMode = settings.canSeeOrdersPage.notMode,
    notAccessRedirectUrl = settings.canSeeOrdersPage.notAccessRedirectUrl,
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

  if (isOrdersListAndOthers) {
    document.body.classList.add('recode-not-access');

    window.location.href = notAccessRedirectUrl;
  }
};

export default canSeeOrdersPage;