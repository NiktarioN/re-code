import { isPageWithRightUserCard } from '../config/constants';

const hideSmsSenderType = () => {
	if (!isPageWithRightUserCard) {
		return;
	}

	const hideNode = () => {
		document.querySelectorAll('.js-sender-message-type-checkbox').forEach((element) => {
			if (element.value === '4' && !element.parentNode?.classList.contains('hide')) {
				element.parentNode.classList.add('hide');
			}
		});
	};

	hideNode();
	setInterval(() => {
		hideNode();
	}, 1000);
};

export default hideSmsSenderType;
