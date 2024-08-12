import { isProductSettingsPage } from '../../../../../utils/page-checker';

const handleCopyClick = (productName) => {
	const requestData = new URLSearchParams();
	requestData.append('Product[title]', `${productName} (Копия)`.replace(/^"+|"+$/g, ''));
	requestData.append('Product[createOffer]', 0);

	fetch('/pl/sales/product/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: requestData.toString(),
	})
		.then(() => fetch('/pl/sales/product'))
		.then((response) => response.text())
		.then((data) => {
			const parser = new DOMParser();
			const doc = parser.parseFromString(data, 'text/html');
			const newProduct = doc.querySelector('.kv-table-wrap tbody tr:first-child td:first-child a').href;
			window.location.replace(newProduct);
		});
};

const addCopyProductButton = () => {
	if (!isProductSettingsPage) {
		return;
	}

	const productName = document.querySelector('.header-with-tags h1').textContent.trim();
	const buttonContainer = document.querySelector('.product-form-container .buttons-row .btn-danger').parentElement;

	const copyButton = document.createElement('a');
	copyButton.className = 'recode-button btn btn-copy btn-default pull-right';
	copyButton.style.marginRight = '10px';
	copyButton.textContent = 'Копировать продукт';
	buttonContainer.appendChild(copyButton);

	document.querySelectorAll('.buttons-row .btn-copy').forEach((button) => {
		if (!button.classList.contains('recode-button')) {
			button.classList.add('hide');
		}
	});

	copyButton.addEventListener('click', () => {
		handleCopyClick(productName);
	});
};

export default addCopyProductButton;
