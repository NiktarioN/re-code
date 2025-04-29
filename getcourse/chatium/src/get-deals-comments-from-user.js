/**
 * Plugin Name: get-deals-comments-from-user
 * Description: Получение всех комментариев из заказов пользователя
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

/* eslint-disable camelcase */

import { getDealsByUserId, getDealComments, getDealCancelReasons } from '@getcourse/sdk';

const CONFIG = {
  MAX_GET_DEALS: 100,
  EXCLUDED_USER_IDS: [],
};

const getDefaultComments = (comments, userId) =>
  comments
    .filter(
      (comment) =>
        comment.user_id !== userId && comment.user_id !== null && !CONFIG.EXCLUDED_USER_IDS.includes(comment.user_id)
    )
    .reverse();

const getCustomFieldComments = (customFields, dealCommentsFieldId) =>
  customFields?.find(({ id: fieldId }) => fieldId === dealCommentsFieldId)?.value || '';

const getCancelReasonName = (reasons, reasonId) => reasons.find(({ id }) => id === reasonId)?.name || '';

const handleRequest = async (ctx, req) => {
  try {
    const { userId: userIdParam, dealCommentsFieldId: dealCommentsFieldIdParam } = req.query;
    const userId = userIdParam ? parseInt(userIdParam, 10) : null;
    const dealCommentsFieldId = dealCommentsFieldIdParam ? parseInt(dealCommentsFieldIdParam, 10) : null;

    if (!userId || !dealCommentsFieldId) {
      return [];
    }

    const cancelReasons = await getDealCancelReasons(ctx);

    const userDeals = await getDealsByUserId(ctx, userId, CONFIG.MAX_GET_DEALS, { tags: false, customFields: true });
    if (!userDeals.length) {
      return [];
    }

    const userDealsPromises = userDeals.map(
      async ({ id, number, created_at, cost, currency, status, cancel_reason_id, positions, custom_fields }) => {
        const comments = await getDealComments(ctx, id);

        return {
          id,
          number,
          created_at,
          cost,
          currency,
          status,
          cancel_reason_name: getCancelReasonName(cancelReasons, cancel_reason_id) || '',
          position_title: positions[0]?.title || '',
          comments: {
            customField: getCustomFieldComments(custom_fields, dealCommentsFieldId),
            default: getDefaultComments(comments, userId),
          },
        };
      }
    );

    return await Promise.all(userDealsPromises);
  } catch {
    return [];
  }
};

app.get('/', handleRequest);