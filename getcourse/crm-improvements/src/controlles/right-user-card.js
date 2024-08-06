import { isEmployee } from '../../../utils/checks';
import { isPageWithRightUserCard } from '../../../../utils/page-checker';

const rightUserCardController = () => {
	if (!isEmployee || !isPageWithRightUserCard) {
		return;
	}

	const rightUserCardMenuObserver = new MutationObserver(() => {
		const node = document.querySelector('.gc-right-active-block .block-items-menu');
		if (!node) {
			return;
		}

		rightUserCardMenuObserver.disconnect();

		node.addEventListener('click', ({ target }) => {
			if (target.closest('[data-reactid=".0.1.1.0.1.1"]')) {
				console.log(target);
			}

			if (target.closest('[data-reactid=".0.1.1.0.1.2"]')) {
				console.log(target);
			}
		});
	});

	rightUserCardMenuObserver.observe(document.querySelector('.gc-right-active-block'), {
		childList: true,
		subtree: true,
	});
};

export default rightUserCardController;
