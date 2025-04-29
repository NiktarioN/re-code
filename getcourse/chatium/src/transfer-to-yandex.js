import { post } from '@app/request';
import { getGcUserData, getDealInfoWithParams, updateDealInfo, addDealComment } from '@getcourse/sdk';

/**
 * Plugin Name: transfer-student-to-tracker
 * Description: Передача информации о новом студенте в Яндекс Трекер
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

const CONFIG = {
  PLUGIN_NAME: 'RE-CODE AGENCY. Передача информации о новом студенте в Яндекс.Трекер',
  FIELDS_IDS: {
    USER: [1059538, 10714714, 10210072, 10571143, 10827336, 10827337, 10827350, 10829014, 10832743, 10832744],
  },
  TRACKER: {
    URL: 'https://api.tracker.yandex.net/v2/issues/',
    ORG_ID: '8168014',
    TOKEN: 'y0__xCS3MWlqveAAhi2oDUg_ObQvxIROAnl00Ax5kksnNIcNOCbFOauAQ',
    QUEUE_ID: '31',
    QUEUE_KEY: 'KS',
  },
  USER_FIELD_NAMES: {
    TG_USERNAME: 'tg_username',
    LAST_PAYMENT_DATE: 'Дата_последней_оплаты',
    PAYMENT_METHOD: 'Способ_оплаты',
    SALE_GROUP: 'Группа_при_продаже',
    PAYMENT_FORM: 'Форма_оплаты',
    TRAINING_PURPOSE: 'Цель_обучения',
    PRACTICE_TIME: 'Выбор_времени_онлайн_практик',
    CLIENT_INFO: 'Информация_о_клиенте_и_комментарий',
    DIPLOMA: 'Диплом',
    BONUSES: 'Бонусы_при_покупке',
    START_TRAINING_DATE: 'Дата_старта_обучения',
  },
  REQUIRED_PARAMS: ['dealId'],
};

const MESSAGES = {
  MISSING_REQUIRED_PARAMS: (params) => `Отсутствуют обязательные параметры в запросе: ${params}`,
  MISSING_REQUIRED_FIELD: (field) => `Обязательное поле не заполнено: ${field}`,
  API_ERROR: (status, message) => `Ошибка API: ${status} — ${message}`,
  INVALID_RESPONSE: 'Неверный формат ответа от API Трекера',
  SUCCESS: (id, key) => `Задача создана. ID: ${id}, Ключ: ${key}`,
  GENERAL_ERROR: 'Произошла неизвестная ошибка',
  DEAL_INFO_ERROR: 'Ошибка получения данных сделки',
  USER_DATA_ERROR: 'Ошибка получения данных пользователя',
  SUCCESS_COMMENT_IN_DEAL: (taskId) => `Клиент успешно передан в КC. Задача: ${taskId} `,
};

const prepareData = (data) => (typeof data === 'object' ? JSON.stringify(data) : data);

const parseDateString = (dateStr) => {
  if (!dateStr) {
    return null;
  }

  const [day, month, year] = dateStr.split('.');
  if (!year || !month || !day) {
    return null;
  }

  return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
};

const formatTrackerDate = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date)) {
    return null;
  }

  return date.toISOString().split('T')[0];
};

const normalizeDate = (dateStr) => {
  const parsedDate = parseDateString(dateStr);
  return formatTrackerDate(parsedDate);
};

const validateParams = (params) => {
  const missingParams = CONFIG.REQUIRED_PARAMS.filter((param) => !params[param]);

  if (missingParams.length) {
    throw new Error(MESSAGES.MISSING_REQUIRED_PARAMS(missingParams.join(', ')));
  }
};

const transformUserFields = (fieldsObject) =>
  Object.entries(fieldsObject).map(([id, field]) => ({
    id: parseInt(id, 10),
    name: field.name,
    value: field.value,
  }));

const createFieldMap = (fields) =>
  fields.reduce((acc, { name, value }) => {
    acc[name] = value;
    return acc;
  }, {});

const flattenTrackerFields = (params) => {
  const fieldNames = CONFIG.USER_FIELD_NAMES;
  const fieldMap = createFieldMap(params.filteredUserFields);

  return {
    linkToGetcourse: params.dealCardLink || null,
    orderNumber: params.dealNumber || null,
    email: params.userEmail || null,
    telephone: params.userPhone || null,
    theLinkToTheMessenger: fieldMap[fieldNames.TG_USERNAME] || null,
    dateOfPurchase: normalizeDate(fieldMap[fieldNames.LAST_PAYMENT_DATE]) || null,
    startDateOfTraining: normalizeDate(fieldMap[fieldNames.START_TRAINING_DATE]) || null,
    managerOP: params.managerName || null,
    referralLink: params.partnerUserLink || null,
    paymenmethod: fieldMap[fieldNames.PAYMENT_METHOD] || null,
    paymentcurrenc: params.dealCurrency || null,
    orderAmoun: params.dealCost || null,
    currentGroupflow: fieldMap[fieldNames.SALE_GROUP].trim() || null,
    formpayment: fieldMap[fieldNames.PAYMENT_FORM] || null,
    thePurposeOfTheTraining: fieldMap[fieldNames.TRAINING_PURPOSE] || null,
    dayOfTheWeekAndPracticeTime: fieldMap[fieldNames.PRACTICE_TIME] || null,
    studentInformation: fieldMap[fieldNames.CLIENT_INFO] || null,
    diplom: fieldMap[fieldNames.DIPLOMA] || null,
    bonuses: fieldMap[fieldNames.BONUSES] || null,
  };
};

const prepareTrackerRequestData = (params) => ({
  summary: `Обучение студента: ${params.userEmail}`,
  queue: {
    id: CONFIG.TRACKER.QUEUE_ID,
    key: CONFIG.TRACKER.QUEUE_KEY,
  },
  ...flattenTrackerFields(params),
});

const createTrackerIssue = async (requestData) => {
  try {
    const response = await post(CONFIG.TRACKER.URL, JSON.stringify(requestData), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `OAuth ${CONFIG.TRACKER.TOKEN}`,
        'X-Org-ID': CONFIG.TRACKER.ORG_ID,
      },
      responseType: 'json',
    });

    if (!response?.body?.id || !response?.body?.key) {
      throw new Error(MESSAGES.INVALID_RESPONSE);
    }

    return {
      status: 'OK',
      message: MESSAGES.SUCCESS(response.body.id, response.body.key),
      trackerId: response.body.id,
      data: requestData,
    };
  } catch (error) {
    const status = error.response?.status || 500;
    const body = error.response?.body?.errors || error.message;

    throw new Error(MESSAGES.API_ERROR(status, prepareData(body)));
  }
};

const processUserData = async (ctx, dealInfo) => {
  const { userId, dealManager, partnerUserId } = dealInfo;

  const userInfo = await getGcUserData(ctx, { id: userId, blocks: ['custom'] });
  const managerInfo = dealManager ? await getGcUserData(ctx, { id: dealManager }) : null;
  const partnerInfo = partnerUserId ? await getGcUserData(ctx, { id: partnerUserId }) : null;

  return { userInfo, managerInfo, partnerInfo };
};

const prepareTrackerParams = (ctx, dealInfo, processedUserData) => {
  const { number: dealNumber, cost: dealCost, currency: dealCurrency } = dealInfo;
  const dealCardLink = `https://${ctx.account.host}/sales/control/deal/update/id/${dealInfo.id}`;

  const { userInfo, managerInfo, partnerInfo } = processedUserData;
  const { custom: userFields } = userInfo;

  const managerName = managerInfo ? `${managerInfo.user.first_name} ${managerInfo.user.last_name}`.trim() : null;
  const partnerUserLink = partnerInfo
    ? `https://${ctx.account.host}/user/control/user/update/id/${partnerInfo.user.id}`
    : null;

  const userFieldsArray = transformUserFields(userFields);
  const filteredUserFields = userFieldsArray
    .filter(({ id }) => CONFIG.FIELDS_IDS.USER.includes(id))
    .map(({ name, value }) => ({ name, value }));

  return {
    dealNumber,
    dealCost,
    dealCurrency,
    dealCardLink,
    managerName,
    partnerUserLink,
    userEmail: userInfo.user.email,
    userPhone: userInfo.user.phone,
    filteredUserFields,
  };
};

const handleError = async (ctx, dealId, error) => {
  const errorMessage = {
    plugin: CONFIG.PLUGIN_NAME,
    success: false,
    error: error.message || MESSAGES.GENERAL_ERROR,
  };

  if (dealId) {
    await updateDealInfo(ctx, {
      dealId,
      addfields: { deal_response: 'ERROR', deal_response_msg: prepareData(errorMessage) },
    });
  }

  return errorMessage;
};

const handleStudentTrackerRequest = async (ctx, req) => {
  try {
    validateParams(req.query);
    const { dealId } = req.query;

    const dealInfo = await getDealInfoWithParams(ctx, dealId, { tags: false, customFields: false });

    const userData = await processUserData(ctx, {
      userId: dealInfo.user_id,
      dealManager: dealInfo.manager_user_id,
      partnerUserId: dealInfo.partner_user_id,
    });

    const trackerParams = prepareTrackerParams(ctx, dealInfo, userData);
    const requestData = prepareTrackerRequestData(trackerParams);
    const result = await createTrackerIssue(requestData);

    const successMessage = {
      plugin: CONFIG.PLUGIN_NAME,
      success: true,
      message: result.message,
      trackerId: result.trackerId,
      data: result.data,
    };

    await addDealComment(ctx, {
      dealId,
      comment: MESSAGES.SUCCESS_COMMENT_IN_DEAL(result.trackerId),
      fromUserId: dealInfo.user_id,
    });

    await updateDealInfo(ctx, {
      dealId,
      addfields: { deal_response: result.status, deal_response_msg: prepareData(successMessage) },
    });

    return successMessage;
  } catch (error) {
    return handleError(ctx, req.query.dealId, error);
  }
};

app.get('/', handleStudentTrackerRequest);