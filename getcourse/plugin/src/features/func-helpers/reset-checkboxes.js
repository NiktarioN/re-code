const resetCheckboxes = () => {
	document.querySelectorAll('[type="checkbox"]').forEach((checkbox) => {
		// eslint-disable-next-line no-param-reassign
		checkbox.checked = false;
	});
};

export default resetCheckboxes;
