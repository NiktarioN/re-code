import { isDealPage, isTrafficPage, isStatisticPage } from '../config/constants';
import redirectToNotAccessPage from '../helpers/redirect-not-access';

const hideMoneyInformation = (redirectUrl) => {
	const targetPages = [isTrafficPage, isTrafficPage, isStatisticPage];
	const isTargetPage = targetPages.some((page) => page);

	const style = document.createElement('style');
	style.innerHTML = `
  .gc-account-user-submenu .menu-item-stat,
  .gc-account-user-submenu .menu-item-statistic {
    display: none !important;
  }
  `;
	document.head.appendChild(style);

	if (isDealPage) {
		document.querySelectorAll('.stat-table').forEach((node) => node.remove());
		[...document.querySelectorAll('button.btn')]
			.filter((node) => node.textContent === 'Посмотреть статистику на графике')
			.forEach((node) => node.remove());
	}

	if (isTargetPage) {
		redirectToNotAccessPage(redirectUrl);
	}
};

export default hideMoneyInformation;
