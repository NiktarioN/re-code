import { isAdmin } from '../../../../utils/checks';
import { isLessonPage } from '../../../../utils/page-checker';
import { currentUrl } from '../../../../../utils/url-utils';

const addRecoveryLinkForLessonBlocks = () => {
	if (!isAdmin && !isLessonPage) {
		return;
	}

	const btnGroup = document.querySelector('.page-header .btn-group');
	if (!btnGroup) {
		return;
	}

	const lessonIdMatch = currentUrl.href.match(/(?<=id=)\d+/);
	const lessonId = lessonIdMatch ? lessonIdMatch[0] : null;
	if (!lessonId) {
		return;
	}

	const recoveryLink = document.createElement('li');
	recoveryLink.innerHTML = `
  <a href="/pl/teach/control/lesson/blocks?id=${lessonId}" target="_blank">
			<span class="glyphicon glyphicon-refresh"></span> Восстановление блоков
	</a>`;

	const divider = document.querySelector('.page-actions .dropdown-menu .divider');
	if (divider) {
		divider.before(recoveryLink);
	}
};

export default addRecoveryLinkForLessonBlocks;
