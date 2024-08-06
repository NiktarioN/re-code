import { isPageWithRightUserCard } from '../../../../../utils/page-checker';

const hideSmsSenderType = () => {
	if (!isPageWithRightUserCard) {
		return;
	}

	const observer = new MutationObserver(() => {
		const node = document.querySelector('.gc-comment-form');
		if (!node) {
			return;
		}

		document.querySelectorAll('.js-sender-message-type-checkbox').forEach(({ value, parentNode }) => {
			if (value === '4' && !parentNode?.classList.contains('hide')) {
				parentNode.classList.add('hide');
			}
		});
	});

	observer.observe(document.body, { childList: true, subtree: true });
};

export default hideSmsSenderType;
