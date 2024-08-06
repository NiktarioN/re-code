import { isPageWithTasks } from '../config/constants';

const showCurrentOrder = () => {
	const userPanelHistorySelector = '#user-panel-history';
	const gcRightActiveBlockSelector = '.gc-right-active-block';

	const highlightOrder = (orderNode) => {
		const orderInfoBlock = orderNode.closest('.info-panel-group');
		if (!orderInfoBlock) {
			return;
		}

		orderInfoBlock.style.cssText += `
    border-radius: 14px;
    border: 2px solid #2d73e7;
    overflow: hidden;
    box-shadow: 1px 1px 1px rgba(0,0,0,.05);
    opacity: 1;`;

		orderInfoBlock.classList.remove('collapsed');
		orderInfoBlock.parentNode.parentNode.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	};

	const getOrderPanel = (orderTitle, nodes) =>
		[...nodes].find((node) => node.textContent.trim() === orderTitle.textContent.trim());

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
		const observer = new MutationObserver(() => {
			const node = document.querySelector(userPanelHistorySelector);
			if (!node) {
				return;
			}

			handleOrdersInfoLoaded(orderTitle);
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

	if (!isPageWithTasks) {
		return;
	}

	const orderTitle =
		document.querySelector('.page-header h1') ||
		document.querySelector('.task-object a[href*="/sales/control/deal/update/id/"]') ||
		document.querySelector('.kanban-card-deal__title');
	if (!orderTitle) {
		return;
	}

	handleRightActiveBlockLoaded(orderTitle);
};

export default showCurrentOrder;
