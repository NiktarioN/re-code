// const acceptAllAppeals = () => {
// 	const wait = (time) =>
// 		new Promise((resolve) => {
// 			setTimeout(() => {
// 				resolve();
// 			}, time);
// 		});

// 	let totalProcessed = 0;
// 	let totalAppeals = 0;
// 	const CANCEL_TEXT = 'Отмена';
// 	const getSuccessText = () => `Обращений обработано: ${totalProcessed}`;

// 	const defaultValue = document.title;

// 	const titleBlink = (totalProcessed) => {
// 		const timerId = setInterval(() => {
// 			document.title = document.title === defaultValue ? `Обращений обработано: ${totalProcessed}` : defaultValue;
// 		}, 800);

// 		return timerId;
// 	};

// 	const createAlert = (timerId) => {
// 		const div = document.createElement('div');
// 		div.textContent = getSuccessText();
// 		div.classList.add('alert-appeals');
// 		const button = document.createElement('button');

// 		button.addEventListener('click', () => {
// 			clearInterval(timerId);
// 			document.title = defaultValue;
// 			div.remove();
// 		});

// 		button.classList.add('fa', 'fa-times', 'text-muted');
// 		div.appendChild(button);

// 		return div;
// 	};

// 	const showAlert = (timerId) => {
// 		const alert = createAlert(timerId);
// 		document.querySelector('body').append(alert);
// 	};

// 	const OFFSET = 20;
// 	const getAppeals = async ({ status, offset, signal }) => {
// 		const formData = new FormData();
// 		formData.append('filter[responsible_type]', 'all');

// 		const statusMap = {
// 			close: '1',
// 			open: '0',
// 		};

// 		const objectTypeIdMap = {
// 			open: '55',
// 			close: '',
// 		};

// 		formData.append('filter[status]', statusMap[status]);
// 		formData.append('filter[offset]', offset);
// 		formData.append('filter[object_type_id]', objectTypeIdMap[status]);
// 		formData.append('filter[with_types]', '1');
// 		formData.append('filter[sorting]', 'pushed_at_asc');

// 		const response = await fetch('/pl/tasks/resp/models-list', {
// 			body: formData,
// 			method: 'POST',
// 			signal,
// 		});

// 		const data = await response.json();
// 		return data;
// 	};

// 	const doAction = async ({ id, action, signal }) => {
// 		const formData = new FormData();
// 		formData.append('id', id);
// 		formData.append('action', action);

// 		const response = await fetch('/pl/tasks/resp/do-action', {
// 			body: formData,
// 			method: 'POST',
// 			signal,
// 		});

// 		const data = await response.json();
// 		return data;
// 	};

// 	const incrementDoActionWithAppeals = async (action, signal) => {
// 		const statusByAction = {
// 			close: 'open',
// 			open: 'close',
// 		};
// 		const status = statusByAction[action];

// 		const data = await getAppeals({ status, offset: '0', signal });
// 		totalAppeals = data.data.count;
// 		const totalRequestsCount = Math.ceil(totalAppeals / OFFSET);

// 		for (let i = 0; i < totalRequestsCount; i++) {
// 			const data1 = await getAppeals({ status, offset: String(i * OFFSET), signal });
// 			const doActionWithModels = data1.data.models.map((model) =>
// 				doAction({ id: model.id, action, signal }).then((result) => {
// 					if (result.success) {
// 						totalProcessed += 1;
// 						updateProgress(totalProcessed, totalAppeals);
// 					}
// 				})
// 			);
// 			await Promise.all(doActionWithModels);
// 			await wait(900);
// 		}
// 	};

// 	const updateProgress = (totalProcessed, totalAppeals) => {
// 		const textContent = totalProcessed === 0 && totalAppeals === 0 ? '' : `${totalProcessed} / ${totalAppeals}`;
// 		document.getElementById('progress-node').textContent = textContent;
// 	};

// 	const handleAllAppealsButtonClick = async (action, button, signal) => {
// 		const initialButtonTextContent = button.textContent;
// 		const buttonTextByAction = {
// 			close: CANCEL_TEXT,
// 			cancel: initialButtonTextContent,
// 		};
// 		button.textContent = buttonTextByAction[action];

// 		const actionByAction = {
// 			close: async () => await incrementDoActionWithAppeals('close', signal),
// 			cancel: () => undefined,
// 		};
// 		await actionByAction[action]();
// 	};

// 	const createProgressNode = () => {
// 		const span = document.createElement('span');
// 		span.setAttribute('id', 'progress-node');
// 		span.classList.add('badge', 'badge-info');
// 		return span;
// 	};

// 	const createAppealButton = (action, text) => {
// 		const button = document.createElement('button');
// 		button.textContent = text;
// 		button.classList.add('btn', 'btn-primary', 'btn-xs', 'close-all-appeal-button');
// 		let controller = new AbortController();
// 		let signal = controller.signal;

// 		button.addEventListener('click', () => {
// 			if (button.textContent === CANCEL_TEXT) {
// 				controller.abort();
// 				const timerId = titleBlink(totalProcessed);
// 				showAlert(timerId);
// 				totalProcessed = 0;
// 				totalAppeals = 0;
// 				updateProgress(totalProcessed, totalAppeals);
// 				controller = new AbortController();
// 				signal = controller.signal;
// 				button.textContent = text;
// 				return;
// 			}
// 			handleAllAppealsButtonClick(action, button, signal).then(() => {
// 				button.textContent = text;
// 				document.getElementById('progress-node').textContent = '';
// 				const timerId = titleBlink(totalProcessed);
// 				showAlert(timerId);
// 				totalProcessed = 0;
// 				totalAppeals = 0;
// 				updateProgress(totalProcessed, totalAppeals);
// 			});
// 		});

// 		return button;
// 	};

// 	const root = document.querySelector('.resp-subject-list');
// 	if (!window.location.href.includes('/pl/tasks/resp')) return;
// 	if (!root) return;

// 	const acceptAllAppealsButton = createAppealButton('close', 'Закрыть все обращения');
// 	const progressNode = createProgressNode();

// 	const container = document.createElement('li');
// 	container.appendChild(progressNode);
// 	container.appendChild(acceptAllAppealsButton);
// 	container.setAttribute('style', 'display: flex; justify-content: flex-end; gap: 12px; align-items: center');
// 	root.appendChild(container);
// };

// export default acceptAllAppeals;
