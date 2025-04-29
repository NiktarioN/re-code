/* eslint-disable no-console */
import { getJsonFromFetch } from '../../../../utils/gets';
import { currentUrl, getSearchParamValue } from '../../../../utils/url-utils';

const targetKeys = ['recode-crm', 'recode-analytics', 'recode-api'];
const targetKeysMap = {
  'recode-crm': 'crm',
  'recode-analytics': 'analytics',
  'recode-api': 'api',
};

const errorMessages = {
  noInput:
    'RE-CODE STUDIO. Плагин gcCrmImprovements. Поля не найдены. Зайдите на страницу доп. полей и попробуйте еще раз',
  noKey: 'RE-CODE STUDIO. Плагин gcCrmImprovements. Ключ для создания полей не указан',
  noTargetKey: 'RE-CODE STUDIO. Плагин gcCrmImprovements. Неверный ключ, поля не могут быть созданы',
  emptyData: 'RE-CODE STUDIO. Плагин gcCrmImprovements. Пустой файл данных полей. Возможно, ошибка с хостингом',
};

const contextMapping = {
  UserContext: 'user',
  DealContext: 'deal',
};

const getFilteredFieldsData = (fieldsData, key) => {
  const mappedKey = targetKeysMap[key];
  if (!mappedKey) {
    return [];
  }

  const contextName = getSearchParamValue(currentUrl, 'contextName');
  const contextType = contextMapping[contextName] || null;

  return fieldsData.filter((field) => field.key === mappedKey && (!contextType || field.object_type === contextType));
};

const createFields = async (key) => {
  const input = document.querySelector('[id="CustomFormValue"]');
  if (!input) {
    throw new Error(errorMessages.noInput);
  }

  if (!key) {
    throw new Error(errorMessages.noKey);
  }

  if (!targetKeys.includes(key)) {
    throw new Error(errorMessages.noTargetKey);
  }

  const fieldsData = await getJsonFromFetch(
    'https://tech-borodach.pro/packages/getcourse/crm-improvements/data/fields-data.json'
  );

  if (!fieldsData.length) {
    throw new Error(errorMessages.emptyData);
  }

  const existingFields = JSON.parse(input.value || '{}');
  existingFields.fields = existingFields.fields || [];

  const existingFieldsMap = new Map(existingFields.fields.map((field) => [field.label, field]));
  const filteredFieldsData = getFilteredFieldsData(fieldsData, key).reverse();

  filteredFieldsData.forEach((field) => {
    const isFieldExisting = existingFieldsMap.has(field.label);
    if (isFieldExisting) {
      // Object.assign(existingField, field);
      console.warn(`Поле "${field.label}" уже создано в проекте. Обнови его вручную`);
    } else {
      if (key === targetKeys[0]) {
        existingFields.fields.unshift(field);
      } else {
        existingFields.fields.push(field);
      }
      console.log(`Поле "${field.label}" добавлено в проект`);
    }
  });

  input.value = JSON.stringify(existingFields);
  console.log('Доп. поля в проекте добавлены. Проверь их добавление и не забудь сохранить изменения');
};

export default createFields;