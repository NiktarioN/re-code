const CONFIG = window.gcray.acceptAllAppeal;
const css = `
  .alert-appeals {
      position: absolute;
      display: flex;
      gap: 8px;
      z-index: 1000;
      top: 20px;
      right: 20px;
      background-color: #dff0d8;
      border-color: #d6e9c6;
      border-radius: 4px;
      border: 1px solid transparent;
      padding: 15px;
      color: #3c763d;
    }

    .alert-appeals button {
        background: none;
        border: none;
    }


    .close-all-appeal-button {
      border-radius: 10px !important;
      font-weight: 700;
    }
  `;
const wait = (time) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(true);
		}, time);
	});
};
let totalProcessed = 0;
let totalAppeals = 0;
const CANCEL_TEXT = 'Отмена';
const getSuccessText = () => {
	return `Обращений обработано: ${totalProcessed}`;
};
const defaultValue = document.title;

const titleBlink = (totalProcessed) => {
	const timerId = setInterval(() => {
		document.title = document.title === defaultValue ? `Обращений обработано: ${totalProcessed}` : defaultValue;
	}, 800);
	return timerId;
};

const createAlert = (timerId) => {
	const div = document.createElement('div');
	div.textContent = getSuccessText();
	div.classList.add('alert-appeals');
	const button = document.createElement('button');
	button.addEventListener('click', () => {
		clearInterval(timerId);
		document.title = defaultValue;
		div.remove();
	});
	button.classList.add('fa', 'fa-times', 'text-muted');
	div.appendChild(button);
	return div;
};

const showAlert = (timerId) => {
	const alert = createAlert(timerId);
	document.querySelector('body').append(alert);
};

const OFFSET = 20;

const getAppeals = async ({ status, offset, signal }) => {
	const formData = new FormData();
	formData.append('filter[responsible_type]', 'all');
	const statusMap = {
		close: '1',
		open: '0',
	};
	const objectTypeIdMap = {
		open: '55',
		close: '',
	};
	formData.append('filter[status]', statusMap[status]);
	formData.append('filter[offset]', offset);
	formData.append('filter[object_type_id]', objectTypeIdMap[status]);
	formData.append('filter[with_types]', '1');
	formData.append('filter[sorting]', 'pushed_at_asc');
	const response = await fetch('/pl/tasks/resp/models-list', {
		body: formData,
		method: 'post',
		signal,
	}).then((data) => data.json());
	return response;
};

const doAction = async ({ id, action, signal }) => {
	const formData = new FormData();
	formData.append('id', id);
	formData.append('action', action);
	const response = await fetch('/pl/tasks/resp/do-action', {
		body: formData,
		method: 'post',
		signal,
	}).then((data) => data.json());

	return response;
};

const incrementDoActionWithAppeals = async (action, signal) => {
	const statusByAction = {
		close: 'open',
		open: 'close',
	};
	const status = statusByAction[action];
	const data = await getAppeals({ status: status, offset: '0', signal });
	totalAppeals = data.data.count;
	const totalRequestsCount = Math.ceil(data.data.count / OFFSET);
	async function* asyncGenerator(maxRequestCount) {
		let i = 0;
		while (i < maxRequestCount) {
			yield i++;
		}
	}
	for await (const i of asyncGenerator(totalRequestsCount)) {
		const offset = 0;
		const data1 = await getAppeals({ status: status, offset: String(offset), signal });
		const doActionWithModels = data1.data.models.map((model) => {
			doAction({ id: model.id, action: action, signal }).then((data) => {
				if (data.success) {
					totalProcessed += 1;
					updateProgress(totalProcessed, totalAppeals);
				}
			});
		});
		await Promise.all(doActionWithModels);
		await wait(900);
	}
	const data2 = await getAppeals({ status: status, offset: '0', signal });
};

const updateProgress = (totalProcessed, totalAppeals) => {
	const textContent = totalProcessed === 0 && totalAppeals === 0 ? '' : `${totalProcessed} / ${totalAppeals}`;
	document.getElementById('progress-node').textContent = textContent;
};

const handleAllAppealsButtonClick = async (action, button, signal) => {
	const initialButtonTextContent = button.textContent;
	const buttonTextByAction = {
		close: CANCEL_TEXT,
		cancel: initialButtonTextContent,
	};
	button.textContent = buttonTextByAction[action];
	const actionByAction = {
		// CHANGE to OPEN for openning appeals
		close: async () => await incrementDoActionWithAppeals('close', signal),
		cancel: () => {},
	};
	await actionByAction[action]();
};

const createProgressNode = () => {
	const span = document.createElement('span');
	span.setAttribute('id', 'progress-node');
	span.classList.add('badge', 'badge-info');

	return span;
};

const createAppealButton = (action, text) => {
	const button = document.createElement('button');
	button.textContent = text;
	button.classList.add('btn', 'btn-primary', 'btn-xs', 'close-all-appeal-button');
	let controller = new window.AbortController();
	let signal = controller.signal;

	button.addEventListener('click', () => {
		if (button.textContent === CANCEL_TEXT) {
			controller.abort();
			const timerId = titleBlink(totalProcessed);
			showAlert(timerId);
			totalProcessed = 0;
			totalAppeals = 0;
			updateProgress(totalProcessed, totalAppeals);
			controller = new AbortController();
			signal = controller.signal;
			button.textContent = text;
			return;
		}

		handleAllAppealsButtonClick(action, button, signal).then(() => {
			button.textContent = text;
			document.getElementById('progress-node').textContent = '';
			const timerId = titleBlink(totalProcessed);
			showAlert(timerId);
			totalProcessed = 0;
			totalAppeals = 0;
			updateProgress(totalProcessed, totalAppeals);
		});
	});

	return button;
};
const main = () => {
	if (!window.location.href.includes('/pl/tasks/resp')) {
		return;
	}

	const root = document.querySelector('.resp-subject-list');
	if (!root) {
		return;
	}

	const acceptAllAppealsButton = createAppealButton('close', 'Закрыть все обращения');
	const progressNode = createProgressNode();
	const container = document.createElement('li');
	const styles = document.createElement('style');
	styles.innerHTML = css;
	container.appendChild(styles);
	container.appendChild(progressNode);
	container.appendChild(acceptAllAppealsButton);
	container.setAttribute('style', 'display: flex; justify-content: flex-end; gap: 12px; align-items: center');

	root.appendChild(container);
};
main();
