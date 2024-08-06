import { isProcessEditorPage } from '../../../../../utils/page-checker';

const getTargetProcessLink = async (processName) => {
	const requestParams = new URLSearchParams({
		'MissionSearch[id]': '',
		'MissionSearch[title]': processName,
	});

	try {
		const response = await fetch(`/pl/tasks/mission/all?${requestParams.toString()}`);
		const data = await response.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(data, 'text/html');

		const processElement = doc.querySelector('.w2[data-key]');
		const processId = processElement.dataset.key;

		return `/pl/tasks/mission/process?id=${processId}`;
	} catch (error) {
		throw new Error(error);
	}
};

const changeNotOwnProcessMessage = async () => {
	if (!isProcessEditorPage) {
		return;
	}

	const targetNode = document.querySelector('.not-own-process-message');
	if (!targetNode) {
		return;
	}

	targetNode.classList.add('recode-not-own-process-message');
	document
		.querySelectorAll('.mission-update > .standard-page-actions > .btn')
		.forEach(({ classList }) => classList.add('hide'));

	const regex = /Используется шаблонный процесс\s*"([^"]*)"\./;
	const match = targetNode.textContent.match(regex)?.[1];
	if (!match) {
		return;
	}

	const templateProcessLink = await getTargetProcessLink(match);
	if (!templateProcessLink) {
		return;
	}

	targetNode.innerHTML = `
    <p class="recode-not-own-process-message__title">Используется шаблон от процесса <strong>"${match}"</strong></p>
    <p class="recode-not-own-process-message__text">
      Нельзя изменять текущий процесс, который основан на шаблоне, т.к. придется дополнительно следить еще и за текущим
      процессом
    </p>
    <p class="recode-not-own-process-message__text">
      Лучше всего редактировать шаблонный процесс, и тогда изменения применятся сразу во всех процессах, где этот
      шаблон был использован
    </p>
    <p class="recode-not-own-process-message__text">
      Если же ты все таки хочешь изменить текущий процесс, то просто скопируй сам процесс с шаблоном, а не выбирай шаблон
      при создании процесса
    </p>
    <a class="recode-not-own-process-message__button btn btn-success" href="${templateProcessLink}"
      rel="noopener noreferrer">Перейти в шаблонный процесс</a>
    <a class="recode-not-own-process-message__author" href="https://techeducation.ru/y/8bbf221" target="_blank"
      rel="noopener noreferrer">Здесь были ребята из RE-CODE</a>
		`;
};

export default changeNotOwnProcessMessage;
