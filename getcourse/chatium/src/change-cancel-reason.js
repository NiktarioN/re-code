import { updateDealInfo, getDealCancelReasons, getDealInfo } from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: '[ RE-CODE AGENCY ] Метод «Обновить заказ в GetCourse»',
  REQUIRED_PARAMS: ['dealId', 'cancelReasonId'],
};

const MESSAGES = {
  MISSING_REQUIRED_PARAMS: (params) => `Отсутствуют обязательные параметры в запросе: ${params}`,
  INVALID_NUMERIC_PARAM: (param) => `Параметр ${param} должен быть числом`,
  GENERAL_ERROR: 'Ошибка при попытке обновить заказ в GetCourse',
  SUCCESS: (dealId) => `Сделка с ID ${dealId} успешно обновлена`,
};

const validateParams = (params) => {
  const missingParams = CONFIG.REQUIRED_PARAMS.filter((param) => !params[param]);

  if (missingParams.length) {
    throw new Error(MESSAGES.MISSING_REQUIRED_PARAMS(missingParams.join(', ')));
  }

  CONFIG.REQUIRED_PARAMS.forEach((param) => {
    if (params[param] && Number.isNaN(Number(params[param]))) {
      throw new Error(MESSAGES.INVALID_NUMERIC_PARAM(param));
    }
  });
};

const getCancelReasonName = (reasons, reasonId) => reasons.find(({ id }) => id === reasonId)?.name || '';

const handleError = async (error) => ({
  plugin: CONFIG.PLUGIN_NAME,
  success: false,
  errors: error.message || MESSAGES.GENERAL_ERROR,
});

const handleRequest = async (ctx, req) => {
  try {
    validateParams(req.query);
    const { dealId, cancelReasonId } = req.query;

    const dealInfo = await getDealInfo(ctx, dealId);
    const dealStatus = dealInfo.status;
    const currentCancelReasonId = dealInfo.cancel_reason_id;

    const cancelReasons = await getDealCancelReasons(ctx);
    const cancelReasonName = getCancelReasonName(cancelReasons, currentCancelReasonId);

    if (dealStatus === 'cancelled') {
      await updateDealInfo(ctx, {
        dealId,
        status: {
          name: 'in_work',
        },
      });
    }

    const result = await updateDealInfo(ctx, {
      dealId,
      status: {
        name: 'cancelled',
        cancel_reason_id: cancelReasonId,
        cancel_reason_comment: `Раньше была причина отказа — «${cancelReasonName}»`,
      },
    });

    return {
      plugin: CONFIG.PLUGIN_NAME,
      success: true,
      message: MESSAGES.SUCCESS(result.id),
    };
  } catch (error) {
    return handleError(error);
  }
};

app.get('/', handleRequest);