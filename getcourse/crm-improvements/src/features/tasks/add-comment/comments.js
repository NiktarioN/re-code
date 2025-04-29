import { CONFIG, MESSAGES } from './config';
import { getDealId, getUserId } from '../../../../../utils/gets';

const validateComment = (text) => {
  const trimmed = text.trim();

  if (trimmed.length < CONFIG.VALIDATION.MIN_LENGTH) {
    throw new Error(MESSAGES.ERROR_EMPTY_COMMENT);
  }

  if (trimmed.length > CONFIG.VALIDATION.MAX_LENGTH) {
    throw new Error(MESSAGES.ERROR_COMMENT_TOO_LONG(CONFIG.VALIDATION.MAX_LENGTH));
  }
};

const getCommentData = (type) => {
  if (type === 'deal') {
    return { id: getDealId(), endpoint: CONFIG.API_ENDPOINTS.DEAL_COMMENT };
  }

  return { id: getUserId(), endpoint: CONFIG.API_ENDPOINTS.USER_COMMENT };
};

const sendComment = async (type, text) => {
  validateComment(text);

  const { id, endpoint } = getCommentData(type);

  if (!id) {
    throw new Error(MESSAGES.ERROR_MISSING_ID(type));
  }

  const url = new URL(endpoint, window.location.origin);
  url.searchParams.append('id', id);
  url.searchParams.append('objectType', type);
  url.searchParams.append('text', text.trim());
  console.log(url.href);

  const response = await fetch(url);
  console.log(response);

  if (!response.ok) {
    throw new Error(MESSAGES.ERROR_SENDING);
  }
};

export default sendComment;