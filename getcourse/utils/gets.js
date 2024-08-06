const getDealId = () => {
  const actionAttribute =
    document.querySelector('form[action*="/sales/control/deal/update/id/"]')?.getAttribute('action') || '';
  const match = actionAttribute.match(/\/id\/(\d+)/);

  return match?.[1] || '';
};

const getDealCost = () => {
  const textContent =
    document.querySelector('form[action*="/sales/control/deal/update/id/"] .summary-tr > .cost')?.textContent || '';
  const match = textContent.replace(/\s/g, '').match(/\d+/);

  return Number(match?.[0]) || 0;
};

const getDealStatus = () => document.querySelector('.deal-info-table .deal-status')?.textContent?.trim() || undefined;

const getTag = (tagEditorNode, tagsSelector, tagName) =>
  [...tagEditorNode.querySelectorAll(tagsSelector)].find(({ textContent }) => textContent === tagName);

export { getDealId, getDealCost, getDealStatus, getTag };
