const createSetting = (id, text) => {
  const node = document.createElement('label');
  node.id = id;
  node.innerHTML = `<input type="checkbox"> ${text}`;

  return node;
};

export { createSetting };
