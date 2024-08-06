import { isHideTalksWidgetPage, isDealPage, isEditMode } from '../../../../../utils/page-checker';

const hideTalksWidgetButton = () => {
	if (!isHideTalksWidgetPage && !isDealPage && !isEditMode) {
		return;
	}

	document.querySelector('.talks-widget-button')?.classList.add('hide');
};

export default hideTalksWidgetButton;
