/* eslint-disable camelcase */
/* eslint-disable no-console */

import settings from '../../../config/settings';
import { isDealPage } from '../../../../../utils/page-checker';
import { getDealId } from '../../../../../utils/gets';
import { orderStatusMap } from '../../../../../utils/helpers';
import { fetchData } from '../../../../../../utils/responses';
import { waitForElement, createElementWithClass } from '../../../../../../utils/dom';
import { formatDate, filterDeals } from './data';

const getCommentsValue = async (fieldId) => {
  try {
    const commentsInput =
      document.querySelector(`#field-input-${fieldId}`) || (await waitForElement(`#field-input-${fieldId}`));
    return commentsInput.value.trim() || null;
  } catch {
    return null;
  }
};

const toggleVisibility = (container, toggleButton) => {
  const isHidden = container.classList.contains('hide');
  container.classList.toggle('hide', !isHidden);
  toggleButton.parentNode.classList.toggle('hide', isHidden);

  localStorage.setItem('recode-deal-comments-visibility', isHidden ? 'show' : 'hide');
};

const initToggleVisibility = (container, containerTitle, toggleButton) => {
  const visibilityState = localStorage.getItem('recode-deal-comments-visibility') || 'show';
  container.classList.toggle('hide', visibilityState === 'hide');
  toggleButton.parentNode.classList.toggle('hide', visibilityState !== 'hide');

  toggleButton.addEventListener('click', () => toggleVisibility(container, toggleButton));
  containerTitle.querySelector('span').addEventListener('click', () => toggleVisibility(container, toggleButton));
};

const createDealStatus = (deal) => {
  const status = orderStatusMap[deal.status] || 'Статус не определен';
  const cancelReason = deal.cancel_reason_name ? `: ${deal.cancel_reason_name}` : '';

  return `${status}${cancelReason}`;
};

const createDealCost = (deal) => {
  const { cost, currency } = deal;
  console.log(cost, currency);

  if (cost && cost > 0) {
    return `<span class="recode-deal-comments__cost">(${cost.toLocaleString('ru-RU')} ${currency})</span>`;
  }

  return '';
};

const createDealSection = (title, deals, currentDealId) => {
  const filteredDeals = deals.filter((deal) => deal.comments.default.length || deal.comments.customField);
  if (!filteredDeals.length) {
    return null;
  }

  const section = createElementWithClass('div', 'recode-deal-comments__section');
  section.setAttribute('aria-expanded', deals[0]?.id === currentDealId ? 'true' : 'false');

  const titleEl = createElementWithClass(
    'button',
    'recode-deal-comments__section-title',
    `
    <i class="recode-deal-comments__icon fa fa-chevron-right"></i>
    <span class="recode-deal-comments__section-text">${title}</span>
    `
  );

  section.appendChild(titleEl);

  const content = createElementWithClass('div', 'recode-deal-comments__content');
  if (deals[0]?.id !== currentDealId) {
    content.classList.add('hide');
  }

  filteredDeals.forEach((deal) => {
    const dealContainer = createElementWithClass('div', 'recode-deal-comments__deal');

    if (deal.id !== currentDealId && (deal.comments.customField || deal.comments.default.length)) {
      dealContainer.innerHTML += `
        <a class="recode-deal-comments__link" href="/sales/control/deal/update/id/${deal.id}/" target="_blank">Заказ #${deal.number}</a>
        ${createDealCost(deal)}
        <span class="recode-deal-comments__status">(${createDealStatus(deal)})</span>
        <span class="recode-deal-comments__position-title">${deal.position_title}</span>
      `;
    }

    if (deal.comments.customField) {
      const customFieldDiv = createElementWithClass(
        'div',
        'recode-deal-comments__custom-field',
        `
        <p class="recode-deal-comments__custom-field-title">Из доп. поля:</p>
        <p class="recode-deal-comments__custom-field-text">${deal.comments.customField.replace(/\n/g, '<br>').trim()}</p>
        `
      );

      dealContainer.appendChild(customFieldDiv);
    }

    if (deal.comments.default.length) {
      dealContainer.innerHTML += `<p class="recode-deal-comments__comment-title">Из истории:</p>`;
    }

    deal.comments.default.forEach(({ created_at, text }) => {
      const commentDiv = createElementWithClass(
        'div',
        'recode-deal-comments__comment',
        `
        <p class="recode-deal-comments__date">${formatDate(created_at)}</p>
        <p class="recode-deal-comments__text">${text.replace(/\n/g, '<br>').trim()}</p>
        `
      );
      dealContainer.appendChild(commentDiv);
    });

    content.appendChild(dealContainer);
  });

  titleEl.addEventListener('click', () => {
    const isExpanded = section.getAttribute('aria-expanded') === 'true';
    section.setAttribute('aria-expanded', !isExpanded);
    content.classList.toggle('hide', isExpanded);
  });

  section.appendChild(content);

  return section;
};

const addCommentsToDOM = (container, containerTitle, toggleButton) => {
  document.querySelector('.page-header')?.after(container);
  container.before(toggleButton.parentNode);

  if (!localStorage.getItem('recode-deal-comments')) {
    localStorage.setItem('recode-deal-comments', 'show');
  }

  initToggleVisibility(container, containerTitle, toggleButton);
}

const getCommentsOnlyFromCustomField = async (customFieldId) => {
  const commentsValue = await getCommentsValue(customFieldId);
  if (!commentsValue) {
    return;
  }

  const container = createElementWithClass('div', 'recode-deal-comments');
  const containerTitle = createElementWithClass(
    'h3',
    'recode-deal-comments__title',
    'Комментарии к заказу <span>Скрыть комментарии</span>'
  );
  const commentsContent = createElementWithClass(
    'div',
    'recode-deal-comments__sections',
    `
    <div class="recode-deal-comments__content">
      <div class="recode-deal-comments__custom-field">
        <p class="recode-deal-comments__custom-field-text">${commentsValue.replace(/\n/g, '<br>')}</p>
      </div>
    </div>
    `
  );
  container.append(containerTitle, commentsContent);

  const toggleButtonWrapper = createElementWithClass('div', 'recode-deal-comments__toggle-button-wrapper');
  const toggleButton = createElementWithClass(
    'a',
    'recode-deal-comments__toggle-button',
    '[RE-CODE] Показать комментарии'
  );
  toggleButtonWrapper.appendChild(toggleButton);

  addCommentsToDOM(container, containerTitle, toggleButton);
};

const getCommentsFromAllDeals = async (customFieldId) => {
  const currentDealId = parseInt(getDealId(), 10);
  const currentDealInfo = await fetchData(`/chtm/re-code/get-current-deal-info?dealId=${currentDealId}`);
  if (!currentDealInfo) {
    console.error('Не удалось получить информацию о текущем заказе');
    return;
  }

  const { created_at: currentDealCreatedAt, user_id: userId } = currentDealInfo;
  const dealsCommentsFromUser = await fetchData(
    `/chtm/re-code/get-deals-comments-from-user?userId=${userId}&dealCommentsFieldId=${customFieldId}`
  );
  if (!dealsCommentsFromUser?.length) {
    return;
  }

  const {
    before: dealsBefore,
    after: dealsAfter,
    current: currentDeal,
  } = filterDeals(dealsCommentsFromUser, currentDealCreatedAt);

  const container = createElementWithClass('div', 'recode-deal-comments');
  const containerTitle = createElementWithClass(
    'h3',
    'recode-deal-comments__title',
    'Комментарии <span>Скрыть комментарии</span>'
  );
  container.appendChild(containerTitle);

  const toggleButtonWrapper = createElementWithClass('div', 'recode-deal-comments__toggle-button-wrapper');
  const toggleButton = createElementWithClass(
    'a',
    'recode-deal-comments__toggle-button',
    '[RE-CODE] Показать комментарии по заказам'
  );
  toggleButtonWrapper.appendChild(toggleButton);

  const sectionWrapper = createElementWithClass('div', 'recode-deal-comments__sections');

  const sections = [
    { title: 'По текущему заказу', deals: currentDeal },
    { title: 'По заказам до текущего заказа', deals: dealsBefore },
    { title: 'По заказам после текущего заказа', deals: dealsAfter },
  ];

  sections.forEach(({ title, deals }) => {
    const section = createDealSection(title, deals, currentDealId);
    if (section) {
      sectionWrapper.appendChild(section);
    }
  });

  if (!sectionWrapper.querySelector('.recode-deal-comments__section')) {
    container.remove();
    toggleButton.remove();
    return;
  }

  container.appendChild(sectionWrapper);
  addCommentsToDOM(container, containerTitle, toggleButton);
};

const init = async (config) => {
  if (!isDealPage) {
    return;
  }

  const {
    dealCommentsFieldId: customFieldId = settings.addDealComments.dealCommentsFieldId,
    mode = settings.addDealComments.mode,
  } = config;

  if (!customFieldId) {
    return;
  }

  if (mode === 'custom-field') {
    await getCommentsOnlyFromCustomField(customFieldId);
  }
  if (mode === 'all-deals') {
    await getCommentsFromAllDeals(customFieldId);
  }
};

export default init;
