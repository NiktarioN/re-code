import { getDealInfoWithParams, createDeal } from '@getcourse/sdk';

const CONFIG = {
  FUNNEL_ID: 19633,
  FUNNEL_STAGE_ID: 191250,
  IGNORED_TAGS: [
    'тех_БЕЗ-ОБРАБОТКИ',
    'срм_АВТООПЛАТА',
    'срм_РАБОТА-МЕНЕДЖЕРА',
    'срм_БЕЗ-ПМ',
    'срм_ПМ',
    'оп_ПРИОРИТЕТ-1',
    'оп_ПРИОРИТЕТ-2',
    'оп_ПРИОРИТЕТ-3',
  ],
};

const MESSAGES = {
  MISSING_PARAMS: 'Не указаны обязательные параметры: currentDealId или newDealOfferId',
  DEAL_INFO_ERROR: (dealId) => `Не удалось получить информацию о сделке с ID ${dealId}`,
  DEAL_CREATED: (dealId) => `Сделка с ID ${dealId} успешно создана`,
  DEAL_CREATION_ERROR: (errorMessage) => `Произошла ошибка при создании сделки: ${errorMessage}`,
  REQUEST_ERROR: (errorMessage) => `Ошибка при обработке запроса: ${errorMessage}`,
};

app.get('/', async (ctx, req) => {
  try {
    const { currentDealId: currentdDealIdStr, newDealOfferId: newDealOfferIdStr } = req.query;
    const currentDealId = currentdDealIdStr ? parseInt(currentdDealIdStr, 10) : null;
    const newDealOfferId = newDealOfferIdStr ? parseInt(newDealOfferIdStr, 10) : null;

    if (!currentDealId || !newDealOfferId) {
      return MESSAGES.MISSING_PARAMS;
    }

    const currentDealInfo = await getDealInfoWithParams(ctx, currentDealId, { tags: true, customFields: false });
    if (!currentDealInfo) {
      return MESSAGES.DEAL_INFO_ERROR(currentDealId);
    }

    const { user_id: userId, tags, number } = currentDealInfo;
    const filteredTags = tags.filter((tag) => !CONFIG.IGNORED_TAGS.includes(tag));

    const result = await createDeal(ctx, {
      user: {
        id: userId,
      },
      deal: {
        deal_status: 'new',
        offers: [{ offer_id: newDealOfferId }],
        addtags: filteredTags,
        disable_notifications: true,
        deal_comment: `Заказ создан для обработки ОП с данными от заказа #${number}`,
        funnel_id: CONFIG.FUNNEL_ID,
        funnel_stage_id: CONFIG.FUNNEL_STAGE_ID,
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
