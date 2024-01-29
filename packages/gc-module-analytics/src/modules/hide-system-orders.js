import { isEmployee } from '../config/constants';

const hideSystemOrders = (words, hideFromEmpoyees) => {
	if (isEmployee && !hideFromEmpoyees) {
		return;
	}

	const hideElement = (search) => {
		const rows = document.querySelectorAll('.main-page-block > .container > table > tbody > tr');
		const lowerCaseSearch = search.toLowerCase();

		rows.forEach((row) => {
			const cells = row.querySelectorAll('td');
			const searchCell = [...cells].find((cell) => cell.innerText.toLowerCase().includes(lowerCaseSearch));

			if (searchCell) {
				row.classList.add('hide');
			}
		});
	};
	words.forEach((word) => hideElement(word));

	const hideContent = () => {
		const titlesTextContent = ['Незавершенные заказы', 'Купленные продукты', 'Завершенные заказы'];
		const filteredTitles = [...document.querySelectorAll('h3')].filter((titleNode) =>
			titlesTextContent.some((title) => titleNode.textContent.trim() === title)
		);

		filteredTitles.forEach((title) => {
			const contentBlock = title.nextElementSibling;
			if (!contentBlock?.classList.contains('table')) {
				return;
			}

			const hasVisibleElements = [...contentBlock.querySelectorAll('tbody > tr')].some(
				(node) => !node.classList.contains('hide')
			);
			if (hasVisibleElements) {
				return;
			}

			contentBlock.classList.add('hide');
			title.classList.add('hide');
		});
	};
	hideContent();
};

export default hideSystemOrders;
