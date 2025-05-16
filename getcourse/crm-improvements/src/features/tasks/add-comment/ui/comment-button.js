import { GLOBAL_CONFIG } from '../../../../config/config';
import { CLASSES } from '../../../../config/constants';
import { CONFIG } from '../core/config';
import { createElement } from '../../../../../../../utils/dom';

const createCommentButton = () => {
  const button = createElement('button', {
    class: CONFIG.CLASSES.ADD_COMMENT_BUTTON,
    type: 'button',
    html: `<i class="${CONFIG.CLASSES.COMMENT_ICON}"></i><span>${CONFIG.TEXTS.COMMENT_BUTTON}</span>`,
  });

  if (GLOBAL_CONFIG.tasks.comments.enableButtonHighlight) {
    button.classList.add(CLASSES.ANIMATIONS.PULSE);
  }

  return button;
};

export default createCommentButton;