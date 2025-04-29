import { isCmsPage, isOneLessonPage } from '../../../../utils/page-checker';

const changeEmail = ({ changeEmailBlockSelector, newEmailFieldSelector }) => {
	if (!isCmsPage || !isOneLessonPage) {
		return;
	}

	const errors = {
		sameEmail:
			'Ваш новый email имеет такое же значение, что и текущий. Если вы хотите изменить текущий email, то введите другое значение',
	};

	const getErrorBlock = (buttonNode) => {
		const div = document.createElement('div');
		div.classList.add('recode-change-email-error', 'hide');
		buttonNode.before(div);

		return div;
	};

	const changeEmailBlock = document.querySelector(changeEmailBlockSelector);
	if (!changeEmailBlock) {
		return;
	}

	const currentEmailField = changeEmailBlock.querySelector('[name="formParams[email]"]');
	const newEmailField = changeEmailBlock.querySelector(newEmailFieldSelector);
	const buttonSubmitForm = changeEmailBlock.querySelectorAll('button[type="submit"]');

	if (!currentEmailField || !newEmailField || !buttonSubmitForm.length) {
		return;
	}

	newEmailField.type = 'email';
	const firstBuilderPartButtonBlock = changeEmailBlock.querySelector('.builder-item.part-button');
	const errorBlock = getErrorBlock(firstBuilderPartButtonBlock);

	const checkCurrentFieldValue = (event) => {
		const currentEmail = currentEmailField.value.trim().toLowerCase();
		const newEmail = newEmailField.value.trim().toLowerCase();

		if (currentEmail === newEmail) {
			event.preventDefault();
			errorBlock.textContent = errors.sameEmail;
			errorBlock.classList.remove('hide');
		} else if (!errorBlock.classList.contains('hide')) {
			errorBlock.classList.add('hide');
		}
	};

	buttonSubmitForm.forEach((button) => button.addEventListener('click', checkCurrentFieldValue));
};

export default changeEmail;
