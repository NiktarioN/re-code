import { transformGcEventParams, updateDealInfo } from '@getcourse/sdk';

app.accountHook('metric-event-event://getcourse/dealCreated', async (ctx, params) => {
  const eventData = transformGcEventParams(ctx, params.event);
  const dealId = eventData.deal.id;
  await updateDealInfo(ctx, {
    dealId,
    addfields: { deal_response: 'RE-CODE. Отловили хук на событие создания заказа' },
  });
});
