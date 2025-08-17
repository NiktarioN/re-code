/* eslint-disable import/no-unresolved */

/**
 * Plugin Name: update-multiple-field-value
 * Description: Обновить значение у доп. поля с множественным выбором
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

import { getDealInfoWithParams, updateDealInfo, getDealCustomFieldsList } from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: '[ RE-CODE AGENCY ] Метод «Обновить значение у доп. поля с множественным выбором»',
  REQUIRED_PARAMS: ['dealId', 'fieldId', 'fieldValue'],
  NUMERIC_PARAMS: ['dealId', 'fieldId'],
};

const MESSAGES = {
  MISSING_REQUIRED_PARAMS: (params) => `Отсутствуют обязательные параметры в запросе: ${params}`,
  INVALID_NUMERIC_PARAM: (param) => `Параметр ${param} должен быть числом и больше 0`,
  FIELD_INDEXES_EMPTY: 'Не переданы номера шаблонов для добавления (пусто или не распознано)',
  FIELD_INDEXES_NOT_FOUND: 'Переданы номера шаблонов, которых нет в справочнике значений',
  DEAL_NOT_FOUND: 'Заказ не найден',
  INVALID_FIELD_TYPE: (actualType) =>
    `Тип текущего доп. поля: «${actualType}» и он является некорректным для работы скрипта. Должен быть «multi_select» (Множественный выбор)`,
  FIELD_LIST_ERROR: 'Не удалось получить список доп. полей по заказам',
  FIELD_SEARCH_ERROR: 'Нет параметра fieldId для поиска доп. поля в проекте',
  FIELD_NOT_FIND: (id) => `Параметр fieldId указан некорректно. Поля (ID: ${id}) нет в проекте`,
  FIELD_TITLE_NOT_CORRECT: (id) => `Заголовок у доп. поля (ID: ${id}) пустой или некорректный`,
  GENERAL_ERROR: 'Ошибка при попытке обновить значение у доп. поля',
  INVALID_ACTION_FORMAT: 'Неверный формат действия. Используйте +номер для добавления, -номер для удаления',
  SUCCESS: (name, value) => `Успешно обновлено значение у доп. поля (NAME: ${name}). Новое значение: ${value}`,
};

const FIELDS_VALUES = {
  1: 'Распределит РОП',
  2: 'Закреплять на ПМ',
  3: 'Закреплять после распределения ПМ',
};

const isPositiveNumber = (value) => {
  const num = Number(value);
  return value !== undefined && value !== null && String(value).trim() !== '' && !Number.isNaN(num) && num > 0;
};

const validateParams = (params) => {
  const missingParams = CONFIG.REQUIRED_PARAMS.filter((param) => !params[param]);

  if (missingParams.length) {
    throw new Error(MESSAGES.MISSING_REQUIRED_PARAMS(missingParams.join(', ')));
  }
};

const normalizeParams = (params) => {
  const normalizedParams = { ...params };

  CONFIG.NUMERIC_PARAMS.forEach((param) => {
    if (isPositiveNumber(params[param])) {
      normalizedParams[param] = Number(params[param]);
    } else if (params[param]) {
      throw new Error(MESSAGES.INVALID_NUMERIC_PARAM(param));
    }
  });

  return normalizedParams;
};

const getFieldTitleOrThrow = async (ctx, fieldId) => {
  if (!fieldId) {
    throw new Error(MESSAGES.FIELD_SEARCH_ERROR);
  }

  const customFieldsList = await getDealCustomFieldsList(ctx);
  if (!customFieldsList) {
    throw new Error(MESSAGES.FIELD_LIST_ERROR);
  }

  const targetField = customFieldsList.find((field) => Number(field.id) === Number(fieldId));
  if (!targetField) {
    throw new Error(MESSAGES.FIELD_NOT_FIND(fieldId));
  }

  if (targetField.type !== 'multi_select') {
    throw new Error(MESSAGES.INVALID_FIELD_TYPE(targetField.type));
  }

  if (!targetField.title) {
    throw new Error(MESSAGES.FIELD_TITLE_NOT_CORRECT(fieldId));
  }

  return targetField.title;
};

const parseActionValue = (value) => {
  if (value.startsWith('+')) {
    const index = Number(value.slice(1));
    return Number.isInteger(index) && index > 0 ? { action: 'add', index } : null;
  }

  if (value.startsWith('-')) {
    const index = Number(value.slice(1));
    return Number.isInteger(index) && index > 0 ? { action: 'remove', index } : null;
  }

  const index = Number(value);
  return Number.isInteger(index) && index > 0 ? { action: 'add', index } : null;
};

const parseFieldActions = (fieldValue) => {
  if (fieldValue === 'reset') {
    return { type: 'reset' };
  }

  const actions = fieldValue
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
    .map(parseActionValue)
    .filter(Boolean);

  return { type: 'actions', actions };
};

const applyFieldActions = (currentValues, parsedActions) => {
  if (parsedActions.type === 'reset') {
    return [];
  }

  return parsedActions.actions.reduce(
    (resultValues, { action, index }) => {
      const fieldValue = FIELDS_VALUES[index];

      if (!fieldValue) {
        return resultValues;
      }

      if (action === 'add') {
        return resultValues.includes(fieldValue) ? resultValues : [...resultValues, fieldValue];
      }

      if (action === 'remove') {
        return resultValues.filter((value) => value !== fieldValue);
      }

      return resultValues;
    },
    [...currentValues]
  );
};

const validateActions = (parsedActions) => {
  if (parsedActions.type === 'reset') {
    return;
  }

  if (parsedActions.actions.length === 0) {
    throw new Error(MESSAGES.FIELD_INDEXES_EMPTY);
  }

  const invalidIndexes = parsedActions.actions.map(({ index }) => index).filter((index) => !FIELDS_VALUES[index]);

  if (invalidIndexes.length) {
    throw new Error(MESSAGES.FIELD_INDEXES_NOT_FOUND);
  }
};

const handleError = (error) => ({
  plugin: CONFIG.PLUGIN_NAME,
  success: false,
  error: error?.message || MESSAGES.GENERAL_ERROR,
});

const handleRequest = async (ctx, req) => {
  try {
    validateParams(req.query);

    const params = normalizeParams(req.query);
    const { dealId, fieldId, fieldValue } = params;

    const parsedActions = parseFieldActions(fieldValue);
    validateActions(parsedActions);

    const fieldTitle = await getFieldTitleOrThrow(ctx, fieldId);

    const dealInfo = await getDealInfoWithParams(ctx, dealId, { tags: false, customFields: true });
    if (!dealInfo) {
      throw new Error(MESSAGES.DEAL_NOT_FOUND);
    }

    const customFields = dealInfo.custom_fields || [];
    const currentFieldValues = customFields.find((field) => Number(field.id) === fieldId)?.value || [];

    const resultFieldValues = applyFieldActions(currentFieldValues, parsedActions);

    await updateDealInfo(ctx, {
      dealId,
      addfields: {
        [fieldTitle]: resultFieldValues,
      },
    });

    return {
      plugin: CONFIG.PLUGIN_NAME,
      success: true,
      message: MESSAGES.SUCCESS(fieldTitle, resultFieldValues.join(', ') || 'пусто'),
    };
  } catch (error) {
    return handleError(error);
  }
};

app.get('/', handleRequest);
