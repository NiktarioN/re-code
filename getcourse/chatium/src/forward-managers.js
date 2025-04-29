import { getGcUserData, getDealInfoWithParams, updateDealInfo } from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: 'RE-CODE AGENCY. Метод «Перенести менеджеров»',
  REQUIRED_PARAMS: ['dealId'],
  MESSAGES: {
    MISSING_DEAL_ID: 'Отсутствует параметр dealId в запросе',
    MISSING_REQUIRED_PARAM: (paramName) =>
      `Обязательный параметр «${paramName}» не найден или имеет некорректный формат`,
    INVALID_DEAL_ID: 'Некорректный идентификатор заказа',
    DEAL_NOT_FOUND: 'Заказ не найден',
    USER_DOES_NOT_HAVE_MANAGER: 'У пользователя нет персонального менеджера',
    MANAGER_NOT_FOUND: 'Менеджер клиента не найден',
    SUCCESS: (name) => `Итог распределения: Распределен на персонального менеджера клиента — ${name}`,
    GENERAL_ERROR: 'Ошибка при попытке закрепить персонального менеджера в заказе',
  },
};

const validateParams = (params) => {
  const missingParams = CONFIG.REQUIRED_PARAMS.filter((param) => !params[param]);

  if (missingParams.length) {
    throw new Error(CONFIG.MESSAGES.MISSING_REQUIRED_PARAM(missingParams.join(', ')));
  }
};

const handleError = async (ctx, dealId, error) => {
  const errorMessage = `${CONFIG.PLUGIN_NAME}: ${error.message || CONFIG.MESSAGES.GENERAL_ERROR}`;

  if (dealId) {
    await updateDealInfo(ctx, {
      dealId,
      addfields: { deal_response: 'ERROR', deal_response_msg: errorMessage },
    });
  }

  return { success: false, message: errorMessage };
};

const handleRequest = async (ctx, req) => {
  try {
    validateParams(req.query);
    const { dealId: dealIdStr } = req.query;
    const dealId = parseInt(dealIdStr, 10);

    if (Number.isNaN(dealId) || dealId <= 0) {
      throw new Error(CONFIG.MESSAGES.INVALID_DEAL_ID);
    }

    const dealInfo = await getDealInfoWithParams(ctx, dealId, { tags: false, customFields: false });

    if (!dealInfo) {
      throw new Error(CONFIG.MESSAGES.DEAL_NOT_FOUND);
    }

    const dealManagerId = dealInfo.manager_user_id;

    const userInfo = await getGcUserData(ctx, { id: dealInfo.user_id });
    const { personal_manager_user_id: personalManagerId } = userInfo.user;

    if (!personalManagerId) {
      return 'Персонального менеджера нет. Можно ничего не менять';
    }

    if (dealManagerId === personalManagerId) {
      return 'Персональный менеджер и менеджер заказа совпадают, делать ничего не нужно';
    }

    await updateDealInfo(ctx, {
      dealId,
      addtags: ['тех_ПЕРЕНОС-МЕНЕДЖЕРА'],
    });

    return 'Нужно перезакрепить персонального менеджера';
  } catch (error) {
    return handleError(ctx, req.query.dealId, error);
  }
};

app.get('/', handleRequest);
