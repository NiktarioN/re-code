const textareasSelectors = '[name="Mission[description]"]';

const adjustHeight = (textarea) => {
  const $textarea = textarea;

  $textarea.style.height = 'auto';
  $textarea.style.height = `${textarea.scrollHeight}px`;
  $textarea.style.overflow = 'hidden';
};

const app = () => {
  const textareas = document.querySelectorAll(textareasSelectors);

  textareas.forEach((textarea) => {
    adjustHeight(textarea);
    textarea.addEventListener('input', () => adjustHeight(textarea));
    window.addEventListener('resize', () => adjustHeight(textarea));
  });
};

export default app;