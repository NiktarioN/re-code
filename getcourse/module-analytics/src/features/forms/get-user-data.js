const getUserData = () => {
	const forms = document.querySelectorAll('form.lt-form');

	forms.forEach((form) => {
		const submitButton = form.querySelector('[type="submit"]');

		submitButton?.addEventListener('click', () => {
			const fullNameField = form.querySelector('[name="formParams[full_name]"]');
			const firstNameField = form.querySelector('[name="formParams[first_name]"]');
			const lastNameField = form.querySelector('[name="formParams[last_name]"]');
			const emailField = form.querySelector('[name="formParams[email]"]');
			const phoneField = form.querySelector('[name="formParams[phone]"]');

			const name =
				fullNameField?.value.trim() || `${firstNameField?.value.trim()} ${lastNameField?.value.trim()}`.trim();
			const email = emailField?.value.trim();
			const phone = phoneField?.value.trim();

			const userData = {};

			if (name) {
				userData.name = name;
			}
			if (email) {
				userData.email = email;
			}
			if (phone) {
				userData.phone = phone;
			}

			if (Object.keys(userData).length) {
				localStorage.setItem('recode-user-data', JSON.stringify(userData));
			}
		});
	});
};
getUserData();

export default getUserData;
