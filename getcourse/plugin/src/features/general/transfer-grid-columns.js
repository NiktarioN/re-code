import { isEmployee } from '../../../../utils/checks';

const handleClickButton = (visibleColumnsParentNode, hiddenColumnsParentNode, button) => {
  const hiddenColumnsFirstElement = hiddenColumnsParentNode.firstElementChild;

  button.addEventListener('click', ({ target }) => {
    if (target.classList.contains('visible-rule')) {
      const columns = [...hiddenColumnsParentNode.querySelectorAll('li[role="option"]')];
      columns.forEach((column) => visibleColumnsParentNode.appendChild(column));
    }
    if (target.classList.contains('hidden-rule')) {
      const columns = [...visibleColumnsParentNode.querySelectorAll('li[role="option"]')].reverse();
      columns.forEach((column) => hiddenColumnsFirstElement.after(column));
    }
  });
};

const createButton = (action, text) => {
  const node = document.createElement('a');
  node.classList.add('recode-grid-columns-transfer-button', 'btn', 'btn-default');
  node.textContent = text;
  node.classList.add(action === 'show' ? 'visible-rule' : 'hidden-rule');

  return node;
};

const addButtons = (modal) => {
  const visibleColumnsParentNode = modal.querySelector('.sortable-visible');
  const hiddenColumnsParentNode = modal.querySelector('.sortable-hidden');

  const actions = [
    { action: 'show', text: 'Показать все колонки' },
    { action: 'hide', text: 'Скрыть все колонки' },
  ];

  actions.forEach(({ action, text }) => {
    const button = createButton(action, text);

    if (action === 'show') {
      hiddenColumnsParentNode.before(button);
    } else {
      visibleColumnsParentNode.before(button);
    }

    handleClickButton(visibleColumnsParentNode, hiddenColumnsParentNode, button);
  });
};

const app = () => {
  if (!isEmployee) {
    return;
  }

  const targetButton = document.querySelector('[title="Персонализировать настройки таблицы"]');
  if (!targetButton) {
    return;
  }

  const modalGrid = document.querySelector(`${targetButton.dataset.target}`);
  if (!modalGrid) {
    return;
  }

  addButtons(modalGrid);
};

export default app;
