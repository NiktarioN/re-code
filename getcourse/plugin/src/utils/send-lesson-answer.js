import { currentUrl } from '../../../../utils/url-utils';

const sendLessonAnswer = (answerText = 'Задание выполнено') => {
	const workPagePathname = 'pl/teach/control/lesson';
	const webString = '/view';
	const appString = '/webview';

	const answerElement = document.querySelector('#LessonAnswer_answer_text');
	const missionElement = document.querySelector('nav.mode-selector a[data-mode="mission"]');

	if (!currentUrl.pathname.includes(workPagePathname)) {
		return;
	}

	const isWebMode = currentUrl.pathname.includes(webString);
	const isAppMode = currentUrl.pathname.includes(appString);

	if ((isWebMode && !answerElement) || (isAppMode && !missionElement)) {
		return;
	}

	const formData = new FormData();
	formData.append('LessonAnswer[answer_text]', answerText);
	formData.append('send-answer', 'true');

	fetch(currentUrl.href, {
		method: 'POST',
		body: formData,
	}).then((response) => {
		if (response.ok) {
			window.location.reload();
		}
	});
};

export default sendLessonAnswer;
