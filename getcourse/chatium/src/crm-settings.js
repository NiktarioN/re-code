import { createDeal } from '@getcourse/sdk';

const CONFIG = {
  USER: {
    FIRST_NAME: 'Тестовый пользователь',
    LAST_NAME: undefined,
    PHONE: '+79999999999',
    EMAIL: 'test@test.ru',
  },
  DEAL: {
    PRODUCT_TITLE: '[тех] Продукт для тестирования настроек',
    PRODUCT_DESCRIPTION: 'Продукт для тестовых предложений. Не используется для выдачи доступов и для продаж',
    OFFER_TITLE: 'Платное тестовое предложение (обычное)',
    DEAL_COST: 10000,
    STATUS: 'in_work',
    DEAL_COMMENT: 'Это тестовый заказ для добавления настроек по CRM. Просьба не трогать его. Он будет удален после запуска системы для менеджеров',
    TAGS: [
      'тех_БЕЗ-ОБРАБОТКИ',
      'тех_ИЗ-ЗАКАЗА',
      'тех_ЗАПУСТИТЬ-ОБРАБОТКУ',
      'тех_БЕЗ-УВЕДОМЛЕНИЙ',
      'тех_СОБРАТЬ-АНАЛИТИКУ',
      'тех_ТЕСТЫ-НАСТРОЕК',
      'тех_СИСТЕМНЫЕ',
      'тех_БЕЗ-СООБЩЕНИЙ',
      'тех_ЗАВЕРШИТЬ-ЗАДАЧИ',
      'срм_АВТООПЛАТА',
      'срм_РАБОТА-МЕНЕДЖЕРА',
      'срм_БЕЗ-ПМ',
      'срм_ПМ',
      'срм_ДУБЛЬ',
      'срм_ПЕРСПЕКТИВНЫЙ',
      'срм_РАБОЧИЕ-ПРЕДЛОЖЕНИЯ',
      'оп_ПРИОРИТЕТ-1',
      'оп_ПРИОРИТЕТ-2',
      'оп_ПРИОРИТЕТ-3',
    ],
    FIELDS: {
      Этап_доски_продаж: 'Забытые',
    },
  },
};

const MESSAGES = {
  DEAL_CREATED: (dealId) => `Сделка с ID ${dealId} успешно создана`,
  DEAL_CREATION_ERROR: (errorMessage) => `Произошла ошибка при создании сделки: ${errorMessage}`,
  REQUEST_ERROR: (errorMessage) => `Ошибка при обработке запроса: ${errorMessage}`,
};

app.get('/create-test-deal', async (ctx) => {
  try {
    const result = await createDeal(ctx, {
      user: {
        first_name: CONFIG.USER.FIRST_NAME,
        last_name: CONFIG.USER.LAST_NAME,
        phone: CONFIG.USER.PHONE,
        email: CONFIG.USER.EMAIL,
      },
      deal: {
        product_title: CONFIG.DEAL.PRODUCT_TITLE,
        product_description: CONFIG.DEAL.PRODUCT_DESCRIPTION,
        deal_cost: CONFIG.DEAL.DEAL_COST,
        deal_status: CONFIG.DEAL.STATUS,
        deal_comment: CONFIG.DEAL.DEAL_COMMENT,
        offers: [
          {
            create_offer: true,
            product_title: CONFIG.DEAL.PRODUCT_TITLE,
            cost: CONFIG.DEAL.DEAL_COST,
          },
        ],
        disable_notifications: true,
        addtags: CONFIG.DEAL.TAGS,
        addfields: CONFIG.DEAL.FIELDS,
      },
    });

    if (result.success) {
      return MESSAGES.DEAL_CREATED(result.deal_id);
    }
    return MESSAGES.DEAL_CREATION_ERROR(result.error_message);
  } catch (error) {
    return MESSAGES.REQUEST_ERROR(error.message);
  }
});