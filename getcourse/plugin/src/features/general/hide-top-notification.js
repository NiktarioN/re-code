import { isHideTopNotificationPage } from '../../../../../utils/page-checker';

const hideTopNotification = () => {
	if (!isHideTopNotificationPage) {
		return;
	}

	const nodesSelectors = '.topNotitication, .notice-top-panel, .margin-top-notice';

	document.querySelectorAll(nodesSelectors).forEach((node) => node.classList.add('hide'));
};

export default hideTopNotification;
