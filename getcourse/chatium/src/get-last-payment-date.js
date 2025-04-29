/**
 * Plugin Name: get-last-payment-date
 * Description: Получить последнюю дату оплаты
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

import { getDealsByUserId, setUserCustomFields } from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: 'RE-CODE AGENCY. Плагин «Получить последнюю дату оплаты»',
  TARGET_FIELD_ID: 10512689,
  MAX_GET_DEALS: 100,
  MESSAGES: {
    MISSING_USER_ID: 'Отсутствует параметр userId в запросе',
    GENERAL_ERROR: 'Ошибка при попытке получить последнюю дату оплаты',
    NO_PAID_DEALS: 'У пользователя нет оплаченных сделок',
    NO_TARGET_PARAM: (paramName) => `Обязательный параметр «${paramName}» не найден или имеет неккоректный формат`,
    NO_TARGET_FIELD: (fieldName) => `Обязательное дополнительное поле ${fieldName}» не найдено`,
    SUCCESS: (date) => `Последняя дата оплаты успешно получена: ${date}`,
  },
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
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

    const paidDeals = userDeals.filter((deal) => deal.is_payed === 1 && deal.payed_at);

    if (!paidDeals.length) {
      throw new Error(CONFIG.MESSAGES.NO_PAID_DEALS);
    }

    paidDeals.sort((a, b) => new Date(b.payed_at) - new Date(a.payed_at));

    const lastPaymentDate = paidDeals[0].payed_at;
    const formattedDate = formatDate(lastPaymentDate);

    await setUserCustomFields(ctx, {
      userId,
      fields: {
        [CONFIG.TARGET_FIELD_ID]: formattedDate,
      },
    });

    return CONFIG.MESSAGES.SUCCESS(formattedDate);
  } catch (error) {
    return `${CONFIG.PLUGIN_NAME}. ${error.message || CONFIG.MESSAGES.GENERAL_ERROR}`;
  }
};

app.get('/', handleRequest);