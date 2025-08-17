/* eslint-disable no-param-reassign */

import settings from '../../config/settings';

const CONFIG = {
  EMAIL_FIELDS_SELECTORS:
    '[name="formParams[email]"], .new-email-input input, .recode-new-email-input input, input[name="email"]',
};

const DOMAIN_CORRECTION_MAP = {
  'gmail.com': [
    'gmail.con',
    'gmail.c',
    'gmail.co',
    'gmal.com',
    'gmil.com',
    'gmaik.com',
    'gmail.ru',
    'gemail.com',
    'gmaii.com',
    'gmall.con',
    'gmai.com',
    'gmaill.com',
    'gamil.com',
    'gmail.conm',
    'gamil.ru',
    'gmaill.ru',
    'gma.com',
    'qmail.com',
    'gmael.com',
  ],
  'mail.ru': [
    'mail.com',
    'msil.con',
    'ma.ru',
    'mai.ru',
    'mai.ryy',
    'mail.du',
    'mail.r',
    'mail.u',
    'meil.ru',
    'maul.ru',
    'mail.ri',
    'mail.tu',
    'mail.ry',
    'mal.con',
    'maik.ru',
    'mailru.com',
    'mial.ru',
    'mails.ru',
    'malil.ru',
    'mailcom.ru',
    'mailu.ru',
    'nail.ru',
  ],
  'yandex.ru': [
    'yadex.ru',
    'yande.ru',
    'yanex.ru',
    'ayndex.ru',
    'yandex.eu',
    'yandex.ri',
    'jandex.ru',
    'ya.ru',
    'yandex.ruu',
    'yandeks.ru',
    'yandex.rru',
    'yandx.ru',
    'yandeex.ru',
  ],
  'list.ru': ['lisr.ru', 'listu.ru', 'list.ruu', 'listt.ru', 'lit.ru'],
  'rambler.ru': ['tambler.ru', 'ramble.ru', 'rambleru.ru', 'rambleer.ru', 'rambler.com'],
  'inbox.ru': ['indox.ru', 'inbox.com', 'inbx.ru', 'inbox.ruu', 'ibnox.ru'],
  'outlook.com': [
    'outlok.com',
    'outlook.co',
    'outlook.con',
    'oulook.com',
    'outllok.com',
    'outlok.co',
    'outloo.com',
    'outloo.ru',
    'outlouk.com',
    'ouutlook.com',
  ],
  'hotmail.com': [
    'hotmai.com',
    'hotmal.com',
    'hotmial.com',
    'hotmaill.com',
    'hootmail.com',
    'hotmail.con',
    'hotmali.com',
    'hotmal.co',
    'hotmai.co',
  ],
  'yahoo.com': ['yahho.com', 'yaoo.com', 'yhoo.com', 'yahooo.com', 'yahhoo.com', 'yaho.com', 'yaoo.co', 'yah.com'],
  'icloud.com': ['iclod.com', 'iclud.com', 'icloid.com', 'icoud.com', 'iclloud.com', 'icoud.co', 'iclod.co'],
  'aol.com': ['aool.com', 'aol.co', 'aool.co', 'aoll.com', 'ao.com', 'aol.con'],
  'protonmail.com': [
    'protonmal.com',
    'protonmail.co',
    'protonmil.com',
    'protomail.com',
    'protinmail.com',
    'protmail.com',
    'protomil.com',
    'protomail.co',
  ],
};

const createHint = (container) => {
  const hint = document.createElement('div');
  hint.classList.add('recode-email-hint');
  container.appendChild(hint);

  return hint;
};

const getHintElement = (container) => container.querySelector('.recode-email-hint') || createHint(container);

const getCorrectedEmail = (field, correctDomain) => {
  const [localPart] = field.value.split('@');

  return `${localPart}@${correctDomain}`;
};

const showEmailCorrectionHint = (field, correctDomain, hint) => {
  const suggestion = getCorrectedEmail(field, correctDomain);
  hint.innerHTML = `Возможно, вы имели в виду: <span>${suggestion}</span>?`;

  const span = hint.querySelector('span');
  const handleClick = () => {
    field.value = suggestion;
    hint.innerHTML = '';
    span.removeEventListener('click', handleClick);
  }
  span.addEventListener('click', handleClick);
};

const preventSpaces = (field) => {
  field.addEventListener('input', (event) => {
    if (event.target.value.includes(' ')) {
      event.target.value = event.target.value.replace(/\s/g, '');
    }
  });
};

const updateEmailFieldValue = (field, correctDomain) => {
  field.value = getCorrectedEmail(field, correctDomain);
};

const findInCorrectDomain = (email) =>
  Object.entries(DOMAIN_CORRECTION_MAP).find(([, incorrectDomains]) =>
    incorrectDomains.some((errorDomain) => email.endsWith(`@${errorDomain}`))
  );

const validateEmailWithSuggestion = (field) => {
  const container = field.closest('.field-content');
  const hint = getHintElement(container);
  const email = field.value;

  const foundDomain = findInCorrectDomain(email);
  if (foundDomain) {
    showEmailCorrectionHint(field, foundDomain[0], hint);
  } else {
    hint.innerHTML = '';
  }
};

const validateEmailAndAutoCorrect = (field) => {
  const email = field.value;
  const foundDomain = findInCorrectDomain(email);

  if (foundDomain) {
    updateEmailFieldValue(field, foundDomain[0]);
  }
};

const init = (config) => {
  const offerUserChoice = config.offerUserChoice || settings.validateEmail.offerUserChoice;
  const emailFields = document.querySelectorAll(CONFIG.EMAIL_FIELDS_SELECTORS);

  emailFields.forEach((field) => {
    preventSpaces(field);

    if (offerUserChoice) {
      field.addEventListener('input', () => validateEmailWithSuggestion(field));
    } else {
      field.addEventListener('blur', () => validateEmailAndAutoCorrect(field));
    }
  });
};

export default init;