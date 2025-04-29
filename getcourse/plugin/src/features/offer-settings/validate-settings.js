import { currentUrl, getSearchParamValue } from '../../../../../utils/url-utils';
import { isOneOfferSettingsPage } from '../../../../utils/page-checker';

const doValidation = (field) => {
	// eslint-disable-next-line no-param-reassign
	field.value = field.value.trim();
};

const getWarningBlock = (content) => {
	const p = document.createElement('p');
	p.classList.add('warning');
	p.style.cssText += 'color: #cc3300;';
	if (content) {
		p.innerHTML = content;
	}

	return p;
};

const setFieldOfferIdValue = () => {
	const offerCodeField = document.querySelector('#offer-code');
	const offerId = getSearchParamValue(currentUrl.href, 'id');

	if (!(offerCodeField && offerId) || offerCodeField.value === offerId) {
		return;
	}

	const warningBlock = getWarningBlock();
	offerCodeField.before(warningBlock);

	if (!offerCodeField.value) {
		offerCodeField.value = offerId;
		warningBlock.innerHTML = `Уникальный идентификатор предложения изменен. Не забудьте сохранить изменения`;
	} else if (!Number.isNaN(Number(offerCodeField.value))) {
		warningBlock.innerHTML = `
    Уникальный идентификатор предложения изменен c <strong>${offerCodeField.value}</strong> на <strong>${offerId}</strong>. Не забудьте сохранить изменения
    `;
		offerCodeField.value = offerId;
	} else {
		warningBlock.innerHTML = `
    Лучше указать в этом поле ID предложения из URL — <strong>${offerId}</strong>. Но сначала нужно убедиться, что данный идентификатор не используется где-то в другом месте на платформе или при интеграции с API
    `;
	}
};

const validateOfferSettings = () => {
	if (!isOneOfferSettingsPage) {
		return;
	}

	const fields = document.querySelectorAll(
		'#offer-title, #offer-code, #paramsobject-after_payment_redirect_url, #paramsobject-form_title'
	);

	fields.forEach((field) => {
		doValidation(field);
		field.addEventListener('change', () => doValidation(field));
	});

	setFieldOfferIdValue();
};

export default validateOfferSettings;
