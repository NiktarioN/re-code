/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */

import { isDealPage } from '../../../../utils/page-checker';
import { getValueFromSelect } from '../../../../../utils/gets';

const MESSAGES = {
  COMMENT_WARNING:
    'Сначала сохрани заказ с написанным комментарием или очисти с ним поле, чтобы можно было менять что-то в заказе',
  STATUS_WARNING:
    'Был изменен статус заказа. Сначала сохрани изменения в заказе, а уже потом пиши комментарий, иначе он неправильно сохранится',
};

const isDealStatusChanged = (selectNode) => {
  const statusValue = getValueFromSelect(selectNode);
  const parentRow = selectNode.closest('.change-status');

  return statusValue !== 'Изменить статус' && parentRow?.style.display === 'table-row';
};

const scrollToCommentBlock = (commentBlock) => {
  alert(MESSAGES.COMMENT_WARNING);
  commentBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

const handleCommentFocus = (commentBlock, dealChangeStatus) => {
  if (isDealStatusChanged(dealChangeStatus)) {
    commentBlock.blur();
    alert(MESSAGES.STATUS_WARNING);
  }
};

const toggleElements = (elements, disable, saveButtons, commentBlock) => {
  elements.forEach((element) => {
    if ([...saveButtons].some((button) => button === element) || element === commentBlock) {
      return;
    }

    const clickHandler = (event) => {
      event.preventDefault();
      event.target.blur();
      scrollToCommentBlock(commentBlock);
    };

    if (element.classList.contains('form-control')) {
      element.disabled = disable;
    }

    if (disable) {
      element.addEventListener('click', clickHandler);
    } else {
      element.removeEventListener('click', clickHandler);
    }
  });
};

const checkCommentBlock = (commentBlock, interactiveElements, saveButtons) => {
  const isCommentBlockFilled = commentBlock.value.trim().length > 0;
  toggleElements(interactiveElements, isCommentBlockFilled, saveButtons, commentBlock);
};

const app = () => {
  if (!isDealPage) {
    return;
  }

  const mainForm = document.querySelector('.page-main-form');
  if (!mainForm) {
    return;
  }

  const interactiveElementsSelectors = 'button, input, a, select, textarea, .status-link, .select2-chosen';
  const interactiveElements = mainForm.querySelectorAll(interactiveElementsSelectors);
  const saveButtons = document.querySelectorAll('.page-actions button.btn-primary, [name="save"]');
  const commentBlock = mainForm.querySelector('[name="Deal[add_comment]"]');
  const dealChangeStatus = document.querySelector('[name="Deal[change_status]"]');

  if (!commentBlock || !dealChangeStatus) {
    return;
  }

  commentBlock.addEventListener('change', () => checkCommentBlock(commentBlock, interactiveElements, saveButtons));
  commentBlock.addEventListener('focus', () => handleCommentFocus(commentBlock, dealChangeStatus));
};

export default app;