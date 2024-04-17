const validateTgLogin = () => {
	const reg = /https?:|\.?t\.me|\//gi;
	const validateSelector = '.recode-validate-tg-login';

	const validate = ($node) => {
		const node = $node;
		node.value = node.value.trim().replace(reg, '').replace(/^@/, '');
	};

	document.querySelectorAll(`${validateSelector} input`).forEach((node) => {
		validate(node);
		node.addEventListener('input', () => validate(node));
	});
};

export default validateTgLogin;
