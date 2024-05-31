import { isEmployee, isTargetUserId } from '../../../../utils/checks';
import { isNotEmptyArray } from '../../../../../utils/checks';
import { isProcessesEditorPage } from '../../../../../utils/page-checker';

const canEditProcesses = (config) => {
	const { idList = [], notMode = false, notAccessRedirectUrl = '/teach/control/stream' } = config;

	if (!isNotEmptyArray(idList) || typeof notMode !== 'boolean') {
		return;
	}

	if (!isEmployee) {
		return;
	}

	const havePermission = notMode ? !isTargetUserId(idList) : isTargetUserId(idList);
	if (havePermission && !window.isSublogined) {
		return;
	}

	if (isProcessesEditorPage) {
		document.body.classList.add('recode-not-access');
		document.querySelector('.form-group.buttons')?.classList.add('hide');
		document.querySelector('.not-own-process-message')?.classList.add('hide');
		window.location.href = notAccessRedirectUrl;
	}
};

export default canEditProcesses;
