import { addSearchParams, updateUrl } from '../../../../../utils/url-utils';

const targetFields = ['name', 'email', 'phone'];

const transferFormFields = () => {
	document.querySelectorAll('form[data-success-url]').forEach((form) => {
		form.querySelector('.t-submit').addEventListener('click', () => {
			const formData = new FormData(form);

			const targetFormParams = [...formData].reduce((acc, [key, value]) => {
				if (targetFields.some((field) => field === key.toLowerCase())) {
					acc.push([key.toLowerCase(), value]);
				}
				return acc;
			}, []);

			const { successUrl } = form.dataset;
			const updatedSuccessUrl = updateUrl(addSearchParams(successUrl, targetFormParams));
			// eslint-disable-next-line no-param-reassign
			form.dataset.successUrl = updatedSuccessUrl;
		});
	});
};

export default transferFormFields;
