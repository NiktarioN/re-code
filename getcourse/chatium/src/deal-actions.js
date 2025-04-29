/* eslint-disable no-undef */
import { addDealComment, getDealInfo, getGcUserData, updateDealInfo } from '@getcourse/sdk';

const MESSAGES = {
  MISSING_DEAL_ID: 'RE-CODE AGENCY. Необходимо указать ID сделки',
  MISSING_DEAL_MANAGER: 'RE-CODE AGENCY. Необходимо указать менеджера',
  DEAL_NOT_FOUND: 'RE-CODE AGENCY. Сделка не найдена',
  ACTION_NOT_SUPPORTED: 'RE-CODE AGENCY. Действие не поддерживается',
  COMMENT_ADDED: 'RE-CODE AGENCY. Комментарий успешно добавлен в заказ',
  SERVER_ERROR: 'RE-CODE AGENCY. Произошла ошибка на сервере',
  MANAGER_NOT_FOUND: 'RE-CODE AGENCY. Не определен менеджер в заказе',
  COMMENT_PARAM_NOT_FOUND: 'RE-CODE AGENCY. Параметр для комментария не найден',
};

const COMMENTS_SAMPLE = {
  DISTRIBUTION_FAILED: 'Итог распределения: Ошибка',
  DISTRIBUTION_DONT_NEED: 'Итог распределения: Распределение не нужно',
  DISTRIBUTION_ROP: 'Итог распределения: Распределит РОП',
  DISTRIBUTION_PM: 'Итог распределения: Распределен на персонального менеджера клиента',
  DISTRIBUTION_WAIT_NEXT_DAY: 'Ожидание следующего дня или рабочего времени менеджеров для распределения',
  HAS_DEAL_MANAGER: 'Итог распределения: Менеджер в заказе уже закреплен вручную или другими способами',
  FINISHED_LOW_PRIORITY: 'Причина завершения: Маленький приоритет для ОП',
  FINISHED_HAVE_HIGH_PRIORITY: 'Причина завершения: Есть более приоритетный заказ',
  FINISHED_PAID_DEAL: 'Причина завершения: Создание платного заказа',
  FUNNEL_REMOVE_DEAL: 'Завершенный или отменный заказ убран с доски заказов для ускорения работы досок',
  MANAGER_NOT_WORKING: (managerName) => `Сброшен менеджер заказа — ${managerName}. Его нет в списке актуальных менеджеров`,
};

const commentActions = {
  distribution_success_deal_manager: {
    comment: async ({ ctx, dealInfo }) => {
      const managerId = dealInfo.manager_user_id;
      if (!managerId) {
        return MESSAGES.MANAGER_NOT_FOUND;
      }

      const managerInfo = await getGcUserData(ctx, { id: managerId });
      if (!managerInfo) {
        return MESSAGES.MANAGER_NOT_FOUND;
      }

      const managerName = `${managerInfo.user.first_name} ${managerInfo.user.last_name}`.trim();

      return `Итог распределения: Распределен на менеджера — ${managerName}`;
    },
  },
  distribution_failed: {
    comment: () => COMMENTS_SAMPLE.DISTRIBUTION_FAILED,
  },
  distribution_dont_need: {
    comment: () => COMMENTS_SAMPLE.DISTRIBUTION_DONT_NEED,
  },
  distribution_rop: {
    comment: () => COMMENTS_SAMPLE.DISTRIBUTION_ROP,
  },
  distribution_pm: {
    comment: () => COMMENTS_SAMPLE.DISTRIBUTION_PM,
  },
  finished_low_priority: {
    comment: () => COMMENTS_SAMPLE.FINISHED_LOW_PRIORITY,
  },
  finished_have_high_priority: {
    comment: () => COMMENTS_SAMPLE.FINISHED_HAVE_HIGH_PRIORITY,
  },
  finished_paid_deal: {
    comment: () => COMMENTS_SAMPLE.FINISHED_PAID_DEAL,
  },
  funnel_remove_deal: {
    comment: () => COMMENTS_SAMPLE.FUNNEL_REMOVE_DEAL,
  },
  has_deal_manager: {
    comment: () => COMMENTS_SAMPLE.HAS_DEAL_MANAGER,
  },
  distribution_wait_next_day: {
    comment: () => COMMENTS_SAMPLE.DISTRIBUTION_WAIT_NEXT_DAY,
  }
};

const actionAliases = {
  1: 'distribution_success_deal_manager',
  2: 'distribution_failed',
  3: 'distribution_dont_need',
  4: 'distribution_rop',
  5: 'distribution_pm',
  6: 'finished_low_priority',
  7: 'finished_have_high_priority',
  8: 'finished_paid_deal',
  9: 'funnel_remove_deal',
  10: 'has_deal_manager',
  11: 'distribution_wait_next_day',
};

const getActionByKey = (key) => {
  const actionKey = actionAliases[key] || key;

  return commentActions[actionKey] || null;
};

const validateInput = (params, requiredFields) => {
  const missingField = requiredFields.find((field) => !params[field]);
  if (missingField) {
    return {
      error: true,
      message: MESSAGES[`MISSING_${missingField.toUpperCase()}`] || 'Не указан обязательный параметр',
    };
  }
  return { error: false };
};

const handleMoneyField = async (params, fieldKey) => {
  const { ctx, dealId, dealInfo, fieldName } = params;

  const targetValue = Math.round(dealInfo[fieldKey]) || '';
  if (!targetValue) {
    return `Не определено значение свойства в заказе ${fieldKey}`;
  }

  const result = await updateDealInfo(ctx, {
    dealId,
    addfields: { [fieldName]: targetValue },
  });

  return result;
};

const actionsMap = {
  sampleComment: {
    requiredFields: ['dealId', 'sample'],
    handler: async (params) => {
      const { ctx, dealId, dealInfo, sample } = params;

      const action = getActionByKey(sample);
      if (!action) {
        return MESSAGES.ACTION_NOT_SUPPORTED;
      }

      const comment = await action.comment({ ctx, dealInfo });
      if (!comment) {
        return MESSAGES.COMMENT_PARAM_NOT_FOUND;
      }

      await addDealComment(ctx, {
        dealId,
        comment,
        fromUserId: dealInfo.user_id,
      });

      return MESSAGES.COMMENT_ADDED;
    },
  },

  comment: {
    requiredFields: ['dealId', 'comment'],
    handler: async (params) => {
      const { ctx, dealId, dealInfo, comment } = params;

      await addDealComment(ctx, {
        dealId,
        comment,
        fromUserId: dealInfo.user_id,
      });

      return MESSAGES.COMMENT_ADDED;
    },
  },

  moneyPayed: {
    requiredFields: ['dealId', 'fieldName'],
    handler: (params) => handleMoneyField(params, 'payed_value'),
  },

  moneyEarned: {
    requiredFields: ['dealId', 'fieldName'],
    handler: (params) => handleMoneyField(params, 'earned_value'),
  },
};

app.get('/', async (ctx, req) => {
  try {
    const { dealId: dealIdStr, action, ...otherParams } = req.query;
    const dealId = dealIdStr ? parseInt(dealIdStr, 10) : null;

    if (!action || !actionsMap[action]) {
      return MESSAGES.ACTION_NOT_SUPPORTED;
    }

    const dealInfo = await getDealInfo(ctx, dealId);
    if (!dealInfo) {
      return MESSAGES.DEAL_NOT_FOUND;
    }

    const { requiredFields, handler } = actionsMap[action];
    const validation = validateInput({ dealId, ...otherParams }, requiredFields);
    if (validation.error) {
      return validation.message;
    }

    return await handler({ ctx, dealId, dealInfo, ...otherParams });
  } catch (error) {
    return `${MESSAGES.SERVER_ERROR}: ${error.message}`;
  }
});
