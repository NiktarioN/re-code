/**
 * Plugin Name: get-offers
 * Description: API для работы с предложениями в проектах
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

import { getOffers } from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: '[ RE-CODE AGENCY ] Метод «Получить настройки предложений в проекте»',
  MAX_LIMIT_OFFERS: 10000,
  TITLES_LST: ['Заявка', 'Предзапись', 'Тариф', 'Консультация', 'Задать вопрос', 'Передать в ОП', 'Участник', 'С сайта'],
  TAGS_LIST: ['ОП'],
  CASE_SENSITIVE: false,
  FILTER_LOGIC: 'or', // 'or' | 'and'
  TITLE_FILTER_MODE: 'include', // 'exclude' | 'include' | 'ignore'
  TAG_FILTER_MODE: 'include', // 'exclude' | 'include' | 'ignore'
};

const MESSAGES = {
  SUCCESS: 'Успешно получены данные о предложениях в аккаунте',
  INVALID_OFFERS_TYPE: 'Некорректные данные: предложения должны быть массивом объектов',
  EMPTY_OFFERS: 'В проекте не найдено ни одного предложения',
  FILTERED_OFFERS_EMPTY: 'После фильтрации не найдено ни одного предложения',
  GENERAL_ERROR: 'Ошибка при попытке получить данные предложений в GetCourse',
};

const createSuccessResponse = (data) => ({
  plugin: CONFIG.PLUGIN_NAME,
  success: true,
  message: MESSAGES.SUCCESS,
  data,
});

const handleError = (error) => ({
  plugin: CONFIG.PLUGIN_NAME,
  success: false,
  errors: error?.message || MESSAGES.GENERAL_ERROR,
});

const validateOffers = (offers) => {
  if (!Array.isArray(offers)) {
    throw new Error(MESSAGES.INVALID_OFFERS_TYPE);
  }

  if (offers.length === 0) {
    throw new Error(MESSAGES.EMPTY_OFFERS);
  }
};

const normalizeString = (str) => (CONFIG.CASE_SENSITIVE ? String(str ?? '') : String(str ?? '').toLowerCase());

const hasMatch = (source, patterns) => {
  if (!source || !patterns.length) {
    return false;
  }
  const normalizedSource = normalizeString(source);

  return patterns.some((pattern) => {
    const normalizedPattern = normalizeString(pattern);
    return normalizedSource.includes(normalizedPattern);
  });
};

const hasAnyTagMatch = (tags, patterns) => {
  if (!Array.isArray(tags) || !tags.length) {
    return false;
  }

  return tags.some((tag) => hasMatch(tag, patterns));
};

const getByMode = (mode, match) => {
  if (mode === 'ignore') {
    return true;
  }
  if (mode === 'exclude') {
    return !match;
  }
  return match;
};

const isOfferMatchByModes = (offer, filterModes = {}) => {
  const {
    titleMode = CONFIG.TITLE_FILTER_MODE,
    tagMode = CONFIG.TAG_FILTER_MODE,
    filterLogic = CONFIG.FILTER_LOGIC,
  } = filterModes;

  const titleMatch = titleMode !== 'ignore' ? hasMatch(offer.title, CONFIG.TITLES_LST) : true;
  const tagMatch = tagMode !== 'ignore' ? hasAnyTagMatch(offer.tags, CONFIG.TAGS_LIST) : true;

  const byTitle = getByMode(titleMode, titleMatch);
  const byTag = getByMode(tagMode, tagMatch);

  if (filterLogic === 'or') {
    return byTitle || byTag;
  }

  return byTitle && byTag;
};

const filterOffersFlexible = (offers, filterModes = {}) => offers.filter((offer) => isOfferMatchByModes(offer, filterModes));

const fetchOffers = async (ctx) => {
  const offers = await getOffers(ctx, {
    showParams: true,
    limit: CONFIG.MAX_LIMIT_OFFERS,
    recodeSelectors: true,
  });
  validateOffers(offers);
  return offers;
};

const filterOffersByBonusCondition = (offers, canUseBonus) =>
  offers
    .filter(
      (offer) =>
        offer.final_price > 0 && offer.is_actual && Boolean(offer.paramsObject?.cannot_use_bonus) === !canUseBonus
    )
    .map((offer) => offer.id);

const filterFreeDealFinish = (offers) =>
  offers.filter(
    (offer) =>
      offer.is_actual && !offer.final_price && offer.paramsObject?.free_deal_finish && isOfferMatchByModes(offer)
  );

const getAllOffersHandler = async (ctx) => {
  try {
    const offers = await fetchOffers(ctx);
    return createSuccessResponse(offers);
  } catch (error) {
    return handleError(error);
  }
};

const getBonusOffersHandler = (canUseBonus) => async (ctx) => {
  try {
    const offers = await fetchOffers(ctx);
    const filteredOffers = filterOffersByBonusCondition(offers, canUseBonus);

    if (filteredOffers.length === 0) {
      throw new Error(MESSAGES.FILTERED_OFFERS_EMPTY);
    }

    return createSuccessResponse(filteredOffers);
  } catch (error) {
    return handleError(error);
  }
};

const getFreeDealFinishHandler = async (ctx) => {
  try {
    const offers = await fetchOffers(ctx);
    const filteredOffers = filterFreeDealFinish(offers);

    if (filteredOffers.length === 0) {
      throw new Error(MESSAGES.FILTERED_OFFERS_EMPTY);
    }

    const result = filteredOffers.map((offer) => `https://${ctx.account.host}/pl/sales/offer/update?id=${offer.id}`);
    return createSuccessResponse(result);
  } catch (error) {
    return handleError(error);
  }
};

const getFlexibleOffersHandler = async (ctx) => {
  try {
    const offers = await fetchOffers(ctx);
    const {
      titleMode = CONFIG.TITLE_FILTER_MODE,
      tagMode = CONFIG.TAG_FILTER_MODE,
      filterLogic = CONFIG.FILTER_LOGIC,
    } = ctx.query || {};

    const filtered = filterOffersFlexible(offers, { titleMode, tagMode, filterLogic });

    if (filtered.length === 0) {
      throw new Error(MESSAGES.FILTERED_OFFERS_EMPTY);
    }

    return createSuccessResponse(filtered);
  } catch (error) {
    return handleError(error);
  }
};

app.get('/all', getAllOffersHandler);
app.get('/can-use-bonuses', getBonusOffersHandler(true));
app.get('/can-not-use-bonuses', getBonusOffersHandler(false));
app.get('/free-deal-finish', getFreeDealFinishHandler);
app.get('/flexible-offers', getFlexibleOffersHandler);
