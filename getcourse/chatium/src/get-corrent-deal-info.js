import { getDealInfo } from '@getcourse/sdk';

app.get('/', async (ctx, req) => {
  try {
    const { dealId: dealIdStr } = req.query;
    const currentDealId = dealIdStr ? parseInt(dealIdStr, 10) : null;

    if (!currentDealId) {
      return null;
    }

    const dealInfo = await getDealInfo(ctx, currentDealId);
    if (!dealInfo) {
      return null;
    }

    return { id: dealInfo?.id, created_at: dealInfo?.created_at, user_id: dealInfo?.user_id };
  } catch {
    return null;
  }
});