import { GLOBAL_CONFIG } from '../../../../config/config';
import { CONFIG, MESSAGES } from '../core/config';
import { getDealId, getUserId, getCurrentUserId } from '../../../../../../utils/gets';
import { toUrlSearchParams, normalizeSpaces } from '../../../../../../../utils/helpers';

const validateComment = (text) => {
  if (!text || text.length < CONFIG.VALIDATION.MIN_LENGTH) {
    throw new Error(MESSAGES.ERROR_EMPTY_COMMENT);
  }

  if (GLOBAL_CONFIG.tasks.comments.enableCommentLimit && text.length > CONFIG.VALIDATION.MAX_LENGTH) {
    throw new Error(MESSAGES.ERROR_COMMENT_TOO_LONG(CONFIG.VALIDATION.MAX_LENGTH));
  }
};

const sendComment = async (type, text) => {
  const normalizedText = normalizeSpaces(text);
  validateComment(normalizedText);

  const id = type === 'deal' ? getDealId() : getUserId();
  const fromUserId = getCurrentUserId() || getUserId();

  if (!id) {
    throw new Error(MESSAGES.ERROR_MISSING_ID(type));
  }

  const searchParams = toUrlSearchParams({
    objectId: id,
    objectType: type,
    fromUserId,
    text: normalizedText,
  });

  const url = new URL(CONFIG.API_ENDPOINT, window.location.origin);

  try {
    const response = await fetch(`${url}?${searchParams.toString()}`);

    if (response.ok) {
      return response.json();
    }

    if (response.status === 404) {
      throw new Error(MESSAGES.ERROR_404);
    }

    throw new Error(MESSAGES.ERROR_SENDING);
  } catch (error) {
    throw new Error(`${MESSAGES.ERROR_SENDING}: ${error.message}`);
  }
};

export { validateComment, sendComment };
