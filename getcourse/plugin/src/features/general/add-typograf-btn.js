/* eslint-disable no-useless-escape */
import Typograf from 'typograf';
import { isEmployee } from '../../../../utils/checks';

// Добавляем правило для пробелов вокруг скобок, если они отсутствуют
Typograf.addRule({
	name: 'common/punctuation/addSpacesAroundBrackets',
	handler: (text) => text.replace(/([^\s])(\[[^\[\]]*|\([^\(\)]*)/g, '$1 $2').replace(/([\]\)])([^\s])/g, '$1 $2'),
});

// Добавляем правило замены "/" на "|"
Typograf.addRule({
	name: 'common/punctuation/replaceSlashWithPipe',
	handler: (text) => text.replace(/\//g, '|'),
});

// Добавляем правило для удаления точки в конце текста, если за ней больше нет контента
Typograf.addRule({
	name: 'common/punctuation/removeFinalPeriod',
	handler: (text) => text.replace(/\.\s*$/, ''),
});

const typograf = new Typograf({ locale: ['ru', 'en-US'] });
// Выключаем правило для удаления пробелов внутри квадратных скобок
typograf.disableRule('common/space/squareBracket');

const config = [
	{ triggerSelector: 'b:has([for="Mailing_title"])', targetSelector: '[name="Mailing[title]"]' },
	{ triggerSelector: '[for="product-title"]', targetSelector: '[name="Product[title]"]' },
	{ triggerSelector: '[for="product-description"]', targetSelector: '[name="Product[description]"]' },
	{ triggerSelector: '[for="widget-title"]', targetSelector: '[name="Widget[title]"]' },
	{ triggerSelector: '[for="preset-title"]', targetSelector: '[name="Preset[title]"]' },
	{ triggerSelector: '[for="offer-title"]', targetSelector: '[name="Offer[title]"]' },
	{ triggerSelector: '[for="paramsobject-form_title"]', targetSelector: '[name="ParamsObject[form_title]"]' },
	{ triggerSelector: '[for="webinar-name"]', targetSelector: '[name="Webinar[name]"]' },
	{ triggerSelector: '[for="litepage-name"]', targetSelector: '[name="LitePage[name]"]' },
	{ triggerSelector: '[for="litepage-title"]', targetSelector: '[name="LitePage[title]"]' },
	{ triggerSelector: '[for="layout-name"]', targetSelector: '[name="Layout[name]"]' },
	{ triggerSelector: '[for="UserGroup_name"]', targetSelector: '[name="UserGroup[name]"]' },
	{ triggerSelector: '[for="UserGroupFolder_name"]', targetSelector: '[name="UserGroupFolder[name]"]' },
	{ triggerSelector: '[for="Segment_title"]', targetSelector: '[name="Segment[title]"]' },
	{ triggerSelector: '[for="Lesson_title"]', targetSelector: '[name="Lesson_title"]' },
	{ triggerSelector: '[for="mission-title"]', targetSelector: '[name="Mission[title]"]' },
	{ triggerSelector: '[for="adoffer-title"]', targetSelector: '[name="AdOffer[title]"]' },
	{ triggerSelector: '[for="Mailing_subject"]', targetSelector: '[name="Mailing[subject]"]' },
	{ triggerSelector: '[for="Mailing_preHeader"] + .hint-block', targetSelector: '[name="Mailing[preHeader]"]' },
	{ triggerSelector: '[for="funnel-title"]', targetSelector: '[name="Funnel[title]"]' },
	{ triggerSelector: '[for="segment-title"]', targetSelector: '[name="Segment[title]"]' },
];

const handleTypografClick = (targetNode, button) => {
	const inputText = targetNode.value;
	const outputText = typograf.execute(inputText);
	// eslint-disable-next-line no-param-reassign
	targetNode.value = outputText;

	targetNode.classList.add('recode-typograf--success');
	button.classList.add('recode-typograf-button--success');
	// eslint-disable-next-line no-param-reassign
	button.textContent = 'Оттипографено';

	setTimeout(() => {
		// eslint-disable-next-line no-param-reassign
		button.textContent = 'Типограф';
		targetNode.classList.remove('recode-typograf--success');
		button.classList.remove('recode-typograf-button--success');
	}, 1000);
};

const createTypografButton = (targetNode) => {
	const button = document.createElement('a');
	button.textContent = 'Типограф';
	button.classList.add('recode-typograf-button');

	button.addEventListener('click', () => handleTypografClick(targetNode, button));

	return button;
};

const addTypografButtons = () => {
	config.forEach(({ triggerSelector, targetSelector }) => {
		const nodes = document.querySelectorAll(triggerSelector);
		nodes.forEach((node) => {
			const targetNode = targetSelector ? document.querySelector(targetSelector) : node;
			if (targetNode) {
				node.after(createTypografButton(targetNode));
			}
		});
	});
};

const initializeTypografButtons = () => {
	if (!isEmployee) {
		return;
	}

	addTypografButtons();
};

export default initializeTypografButtons;
