import { isCmsPage } from '../../../utils/page-checker';

const validateTgLogin = () => {
	if (!isCmsPage) {
		return;
	}

	const reg = /https?:|\.?t\.me|\//gi;
	const validateSelectors = ['.recode-validate-tg-login', '.input__telegram'];

	const validate = (node) => {
		// eslint-disable-next-line no-param-reassign
		node.value = node.value.trim().replace(reg, '').replace(/^@/, '');
	};

	validateSelectors.forEach((selector) => {
		document.querySelectorAll(`${selector} input`).forEach((node) => {
			validate(node);
			node.addEventListener('input', () => validate(node));
		});
	});
};

export default validateTgLogin;
