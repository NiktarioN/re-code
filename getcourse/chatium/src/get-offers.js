/**
 * Plugin Name: get-offers
 * Description: API для работы с бонусными рублями в предложениях
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

import { getOffers } from '@getcourse/sdk';

const CONFIG = {
  PLUGIN_NAME: '[ RE-CODE AGENCY ] Метод «Получить настройки предложений в проекте»',
  MAX_LIMIT_OFFERS: 10000,

  // Режим работы фильтра: 'exclude' - исключать, 'include' - включать
  FILTER_MODE: 'exclude', // 'exclude' | 'include'

  // Настройки для фильтрации (работают в зависимости от выбранного режима)
  TITLES: [
    'Регистрация',
    'Технический продукт',
    'Демо-доступ',
    'Запись вебинара',
    'Мини-курс',
    'Начисление бонусных рублей',
    'Скидка 20 %',
    'бонусных рублей',
    'доступ',
  ],
  TAGS: ['регистрация', 'Reg-0', 'tech'],
  CASE_SENSITIVE: false,
};

const MESSAGES = {
  SUCCESS: 'Успешно получены данные о предложениях в аккаунте',
  INVALID_OFFERS: 'Некорректные данные о предложениях',
  GENERAL_ERROR: 'Ошибка при попытке получить данные предложений в GetCourse',
  INVALID_FILTER_MODE: 'Некорректный режим фильтрации',
};

const createSuccessResponse = (data) => ({
  plugin: CONFIG.PLUGIN_NAME,
  success: true,
  message: MESSAGES.SUCCESS,
  data,
});

const handleError = async (error) => ({
  plugin: CONFIG.PLUGIN_NAME,
  success: false,
  errors: error.message || MESSAGES.GENERAL_ERROR,
});

const validateOffers = (offers) => {
  if (!Array.isArray(offers)) {
    throw new Error(MESSAGES.INVALID_OFFERS);
  }
};

const normalizeString = (str) => (CONFIG.CASE_SENSITIVE ? str : str?.toLowerCase());

const hasMatch = (source, patterns) => {
  if (!source || !patterns.length) return false;

  const normalizedSource = normalizeString(source);
  return patterns.some(pattern => {
    const normalizedPattern = normalizeString(pattern);
    return normalizedSource.includes(normalizedPattern);
  });
};

const shouldFilterOffer = (offer) => {
  const titleMatch = hasMatch(offer.title, CONFIG.TITLES);
  const tagMatch = hasMatch(offer.tags?.join(','), CONFIG.TAGS);
  const hasMatches = titleMatch || tagMatch;

  switch (CONFIG.FILTER_MODE) {
    case 'exclude': return hasMatches;
    case 'include': return !hasMatches;
    default: throw new Error(MESSAGES.INVALID_FILTER_MODE);
  }
};

const fetchOffers = async (ctx) => {
  const offers = await getOffers(ctx, {
    showParams: true,
    limit: CONFIG.MAX_LIMIT_OFFERS
  });
  validateOffers(offers);
  return offers;
};

const filterOffersByBonusCondition = (offers, canUseBonus) =>
  offers
    .filter(offer =>
      offer.final_price > 0 &&
      offer.is_actual &&
      Boolean(offer.paramsObject?.cannot_use_bonus) === !canUseBonus &&
      !shouldFilterOffer(offer)
    )
    .map(offer => offer.id);

const filterFreeDealFinish = (offers) =>
  offers.filter(offer =>
    offer.is_actual &&
    !offer.final_price &&
    offer.paramsObject?.free_deal_finish &&
    !shouldFilterOffer(offer)
  );

const getAllOffersHandler = async (ctx) => {
  try {
    const offers = await fetchOffers(ctx);
    const filteredOffers = offers.filter(offer => !shouldFilterOffer(offer));
    return createSuccessResponse(filteredOffers);
  } catch (error) {
    return handleError(error);
  }
};

// Остальные обработчики без изменений
app.get('/all', getAllOffersHandler);
app.get('/can-use-bonuses', getBonusOffersHandler(true));
app.get('/can-not-use-bonuses', getBonusOffersHandler(false));
app.get('/free-deal-finish', getFreeDealFinishHandler);