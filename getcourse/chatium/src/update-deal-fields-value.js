import { updateDealInfo } from '@getcourse/sdk';

const MESSAGES = {
  MISSING_DEAL_ID: 'RE-CODE AGENCY. Необходимо указать ID сделки',
  SERVER_ERROR: 'RE-CODE AGENCY. Произошла ошибка на сервере',
  FAILED_UPDATE: 'RE-CODE AGENCY. Не получилось обновить информацию в заказе',
  SUCCESS: 'OK',
};

const DEFAULT_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

const transformParams = (params) =>
  Object.entries(params).reduce((acc, [key, value]) => {
    if (key.includes(DEFAULT_PARAMS) || value !== '') {
      acc[key] = value;
    }

    return acc;
  }, {});

const areAllFieldsEmpty = (params) =>
  Object.values(params).every((value) => value === '');

app.get('/', async (ctx, req) => {
  try {
    const { dealId: dealIdStr, ...otherParams } = req.query;
    const dealId = dealIdStr ? parseInt(dealIdStr, 10) : null;

    if (!dealId) {
      return MESSAGES.MISSING_DEAL_ID;
    }

    if (areAllFieldsEmpty(otherParams)) {
      return MESSAGES.SUCCESS;
    }

    const addFields = transformParams(otherParams);
    if (!Object.keys(addFields).length) {
      return MESSAGES.SUCCESS;
    }

    const result = await updateDealInfo(ctx, {
      dealId,
      addfields: addFields,
    });

    if (result.id === dealId) {
      ctx.account.log('success updateDealInfo', { json: { addFields } });
      return MESSAGES.SUCCESS;
    }
    return MESSAGES.FAILED_UPDATE;
  } catch (error) {
    return `${MESSAGES.SERVER_ERROR}: ${error.message}`;
  }
});