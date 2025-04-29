/**
 * Plugin Name: get-amount-purchases
 * Description: Получить количество оплат у клиента
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

import { getDealsByUserId, setUserCustomFields } from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: 'RE-CODE AGENCY. Метод «Получить количество оплат у клиента»',
  TARGET_FIELD_ID: 10512689,
  MAX_GET_DEALS: 100,
  MESSAGES: {
    MISSING_USER_ID: 'Отсутствует параметр userId в запросе',
    GENERAL_ERROR: 'Ошибка при попытке получить последнюю дату оплаты',
    NO_PAID_DEALS: 'У пользователя нет оплаченных сделок',
    NO_TARGET_PARAM: (paramName) => `Обязательный параметр «${paramName}» не найден или имеет неккоректный формат`,
    NO_TARGET_FIELD: (fieldName) => `Обязательное дополнительное поле ${fieldName}» не найдено`,
    SUCCESS: (date) => `Количество оплат у клиента успешно получено: ${date}`,
  },
};

const handleRequest = async (ctx, req) => {
  try {
    const { userId: userIdParam } = req.query;

    if (!userIdParam) {
      throw new Error(CONFIG.MESSAGES.MISSING_USER_ID);
    }

    const userId = parseInt(userIdParam, 10);

    if (Number.isNaN(userId) || userId <= 0) {
      throw new Error(CONFIG.MESSAGES.NO_TARGET_PARAM('userId'));
    }

    const userDeals = await getDealsByUserId(ctx, userId, CONFIG.MAX_GET_DEALS, { tags: false, customFields: false });

    const paidDeals = userDeals.filter((deal) => deal.is_payed === 1 && deal.payed_at && deal.earned_value > 0);
    const paidDealsCount = paidDeals.length;

    if (!paidDealsCount) {
      throw new Error(CONFIG.MESSAGES.NO_PAID_DEALS);
    }

    await setUserCustomFields(ctx, {
      userId,
      fields: {
        [CONFIG.TARGET_FIELD_ID]: paidDealsCount,
      },
    });

    return CONFIG.MESSAGES.SUCCESS(paidDealsCount);
  } catch (error) {
    return `${CONFIG.PLUGIN_NAME}. ${error.message || CONFIG.MESSAGES.GENERAL_ERROR}`;
  }
};

app.get('/', handleRequest);