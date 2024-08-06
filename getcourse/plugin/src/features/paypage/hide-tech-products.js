import { isPayPage } from '../../../../../utils/page-checker';

const hideTechProducts = () => {
	if (!isPayPage) {
		return;
	}

	const searchWords = ['тех'];

	const hideElement = (search) => {
		const products = document.querySelectorAll('.deal-positions .text-muted.small');
		const lowerCaseSearch = search.toLowerCase();

		products.forEach((product) => {
			const needHide = product.textContent.toLowerCase().includes(lowerCaseSearch);

			if (needHide) {
				product.classList.add('hide');
			}
		});
	};

	searchWords.forEach((word) => hideElement(word));
};

export default hideTechProducts;
