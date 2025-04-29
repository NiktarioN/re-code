import { toUrlSearchParams } from '../../utils/helpers';

const getDealId = () => {
  const attribute =
    document.querySelector('form[action*="/sales/control/deal/update/id/"]')?.getAttribute('action') || document.querySelector('[href*="/sales/control/deal/update/id/"]')?.getAttribute('href') || '';
  const match = attribute.match(/\/id\/(\d+)/);

  return match?.[1] || '';
};

const getUserId = () => {
  const attribute =
    document.querySelector('.user-name [href*="/user/control/user/update/id/"]')?.getAttribute('href') || '';
  const match = attribute.match(/\/id\/(\d+)/);

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

// ПРОЦЕССЫ
const getProcessData = async (processName) => {
  const requestParams = toUrlSearchParams({
    'MissionSearch[id]': '',
    'MissionSearch[title]': processName,
  });

  try {
    const response = await fetch(`/pl/tasks/mission/all?${requestParams}`);
    const data = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');

    const processElement = doc.querySelector('.w2[data-key]');

    if (processElement) {
      const processId = processElement.dataset.key;

      return {
        id: processId,
        link: `/pl/tasks/mission/update?id=${processId}`,
        processLink: `/pl/tasks/mission/process?id=${processId}`,
      };
    }

    console.error(`Не удалось найти созданный процесс "${processName}"`);

    return null;
  } catch (error) {
    console.error(`Произошла ошибка при выполнении fetch в getProcessLink: ${error.message}`);

    return null;
  }
};

// ПОЛУЧЕНИЕ ДАННЫХ
const getObjectList = async (url) =>
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data.models.reduce((accumulator, object) => {
        accumulator.push({ id: object.id || object.key, name: object.title || object.label });

        return accumulator;
      }, []);
    })
    .catch((error) => {
      console.error(`Произошла ошибка при выполнении fetch в getObjectList: ${error.message}`);

      return [];
    });

export { getDealId, getUserId, getDealCost, getDealStatus, getTag, getProcessData, getObjectList };
