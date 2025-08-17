// @shared
import { getOffers } from '@getcourse/sdk';
import { CONFIG, MESSAGES } from '../config/constants';
import { mapOfferToResponse } from '../utils/helpers';

export const getOffersList = async (ctx) => {
  try {
    const offers = await getOffers(ctx, { limit: CONFIG.MAX_OFFERS_LIMIT });
    return offers.map(mapOfferToResponse);
  } catch (error) {
    throw new Error(MESSAGES.OFFERS_LOAD_ERROR);
  }
};

export const offersListRoute = app.get('/offers', async (ctx, req) => await getOffersList(ctx));