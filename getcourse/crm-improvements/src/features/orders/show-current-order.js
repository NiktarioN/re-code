import { isPageWithDeals } from '../../config/constants';
import { isDeviceWidthLessThan1200 } from '../../../../../utils/checks';

const showCurrentOrder = () => {
	const userPanelHistorySelector = '#user-panel-history';
	const gcRightActiveBlockSelector = '.gc-right-active-block';

	const highlightOrder = (orderNode) => {
		const orderInfoBlock = orderNode.closest('.info-panel-group');
		if (!orderInfoBlock) {
			return;
		}

		orderInfoBlock.classList.add('recode-deal-panel-highlight');
		orderInfoBlock.classList.remove('collapsed');
		orderInfoBlock.addEventListener('click', () => {
			orderInfoBlock.classList.add('recode-deal-panel-highlight');
		});

		if (!isDeviceWidthLessThan1200) {
			orderInfoBlock.parentNode.parentNode.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}
	};

	const getOrderPanel = (orderTitle, nodes) =>
		[...nodes].find(({ textContent }) => textContent.trim() === orderTitle.textContent.trim());

	const handleOrdersInfoLoaded = (orderTitle) => {
		const observer = new MutationObserver(() => {
			const nodes = document.querySelectorAll(`${userPanelHistorySelector} a[href*='/sales/control/deal/update/id/']`);
			if (!nodes.length) {
				return;
			}

			const orderNode = getOrderPanel(orderTitle, nodes);
			if (orderNode) {
				observer.disconnect();
				highlightOrder(orderNode);
			}
		});

		observer.observe(document.querySelector(userPanelHistorySelector), { childList: true, subtree: true });
	};

	const handleUserPanelHystoryLoaded = (orderTitle) => {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type !== 'childList') {
					return;
				}

				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === 1 && node.matches(userPanelHistorySelector)) {
						handleOrdersInfoLoaded(orderTitle);
					}
				});
			});
		});

		observer.observe(document.querySelector(gcRightActiveBlockSelector), { childList: true, subtree: true });
	};

	const handleRightActiveBlockLoaded = (orderTitle) => {
		const observer = new MutationObserver(() => {
			const node = document.querySelector(gcRightActiveBlockSelector);
			if (!node) {
				return;
			}

			observer.disconnect();
			handleUserPanelHystoryLoaded(orderTitle);
		});

		observer.observe(document.body, { childList: true, subtree: true });
	};

	const handleOrderTitleLoaded = () => {
		const observer = new MutationObserver(() => {
			const orderTitle = document.querySelector(
				'.page-header h1, .task-object a[href*="/sales/control/deal/update/id/"], .kanban-card-deal__title, gc-user-link a[href*="/sales/control/deal/update/id/"]'
			);
			if (!orderTitle) {
				return;
			}

			observer.disconnect();
			handleRightActiveBlockLoaded(orderTitle);
		});

		observer.observe(document.body, { childList: true, subtree: true });
	};

	if (!isPageWithDeals) {
		return;
	}

	handleOrderTitleLoaded();
};

export default showCurrentOrder;
