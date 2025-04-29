import { isHideTalksWidgetPage, isEditMode } from '../../../../utils/page-checker';

const hideTalksWidgetButton = () => {
  if (!isHideTalksWidgetPage && !isEditMode) {
    return;
  }

  document.querySelector('.talks-widget-button')?.classList.add('hide');
};

export default hideTalksWidgetButton;
