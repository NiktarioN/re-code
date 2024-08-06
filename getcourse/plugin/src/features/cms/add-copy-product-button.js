const addCopyProductButton = () => {
	if (!window.location.href.includes('/pl/sales/product/update')) {
		return;
	}

	const productName = document.querySelector('.header-with-tags h1').textContent.trim();
	const buttonContainer = document.querySelector('.product-form-container .buttons-row .btn-danger').parentElement;

	const copyButton = document.createElement('a');
	copyButton.className = 'recode-button btn btn-copy btn-default pull-right';
	copyButton.style.marginRight = '10px';
	copyButton.textContent = 'Копировать продукт';
	buttonContainer.appendChild(copyButton);

	const handleCopyClick = () => {
		const requestData = new URLSearchParams();
		requestData.append('Product[title]', JSON.stringify(`${productName} (Копия)`).replace(/['"«»]/g, ''));
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

	copyButton.addEventListener('click', handleCopyClick);
};

export default addCopyProductButton;
