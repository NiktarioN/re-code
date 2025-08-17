import { transformGcEventParams, getDealInfoWithParams, getDealCustomFieldsList } from '@getcourse/sdk';
import { PROJECT_NAME_SHORT_BRACKETS, CURRENT_HOOK, MAIN_OBJECTS, PLUGIN_NAME } from '../../core/constants';
import { handleError, MESSAGES } from '../../common/messages';
import { parseObjectId } from '../../helpers/parse-object-id';
import { registerTask, runTasksForDeal } from '../core/task-runner';
import { whoCreatedDealTask } from '../tasks/who-created-deal';

const DEAL_CREATED_TASKS = {
  whoCreatedDeal: whoCreatedDealTask,
};

Object.entries(DEAL_CREATED_TASKS).forEach(([taskName, taskFunction]) => {
  registerTask(taskName, taskFunction);
});

app[CURRENT_HOOK]('metric-event-event://getcourse/dealCreated', async (ctx, params) => {
  const eventData = (() => {
    try {
      return transformGcEventParams(ctx, params.event);
    } catch (error) {
      throw new Error(`Ошибка парсинга данных события: ${error.message}`);
    }
  })();

  const dealId = parseObjectId(eventData.deal.id);

  try {
    ctx.account.log(`${PROJECT_NAME_SHORT_BRACKETS} Создан новый заказ`, { eventData });

    const dealInfo = await getDealInfoWithParams(ctx, dealId);
    if (!dealInfo) {
      throw new Error(MESSAGES.OBJECT_NOT_FOUND(dealId, 'DealCreated hook'));
    }

    const projectCustomFields = await getDealCustomFieldsList(ctx);
    if (customFields.length === 0) {
      throw new Error(MESSAGES.MISSING_CUSTOM_FIELDS(MAIN_OBJECTS.DEAL));
    }

    const result = await runTasksForDeal(
      'deal-created',
      ctx,
      dealInfo,
      projectCustomFields,
      Object.keys(DEAL_CREATED_TASKS)
    );

    return {
      plugin: PLUGIN_NAME,
      event: 'deal-created',
      success: true,
      dealId,
      ...result
    };
  } catch (error) {
    const errorResult = handleError(error);

    ctx.account.log(`${PROJECT_NAME_SHORT_BRACKETS} Ошибка при создании заказа`, {
      dealId,
      error: error.message,
      stack: error.stack
    });

    return {
      ...errorResult,
      dealId,
      event: 'deal-created'
    };
  }
});
