import { isCmsPage } from '../../../../utils/page-checker';

const openWindowPageViewLink = () => {
	if (!isCmsPage) {
		return;
	}

	document.querySelectorAll('.page-view-link').forEach((node) => node.setAttribute('target', '_blank'));
};

export default openWindowPageViewLink;
