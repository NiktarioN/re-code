const createHintNode = (text, addIcon = false) => {
  const node = document.createElement('div');
  node.classList.add('hint');

  if (addIcon) {
    const icon = document.createElement('i');
    icon.classList.add('fa', 'fa-lightbulb-o');
    icon.setAttribute('aria-hidden', 'true');
    node.appendChild(icon);
  }

  const span = document.createElement('span');
  span.innerHTML = text;
  node.appendChild(span);

  return node;
};

export default createHintNode;