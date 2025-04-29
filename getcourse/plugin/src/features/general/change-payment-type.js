import { isLayoutPage } from '../../../../utils/page-checker';

const changePaymentType = (config = []) => {
	if (isLayoutPage) {
		return;
	}

	const querySelectorAllByText = (string, node = window.document.body, acc = []) => {
		if (!node.childNodes.length) {
			if (node.textContent.toLowerCase().includes(string.toLowerCase())) {
				return [...acc, node];
			}
			return acc;
		}

		const { childNodes } = node;

		return [...acc, ...Array.from(childNodes).flatMap((child) => querySelectorAllByText(string, child))];
	};

	setInterval(() => {
		config.forEach(([oldPaymentSystem, newPaymentSystem]) => {
			const nodesWithText = querySelectorAllByText(oldPaymentSystem);
			nodesWithText.forEach((node) => {
				// eslint-disable-next-line no-param-reassign
				node.textContent = node.textContent.replace(oldPaymentSystem, newPaymentSystem);
			});
		});
	}, 500);
};

export default changePaymentType;
