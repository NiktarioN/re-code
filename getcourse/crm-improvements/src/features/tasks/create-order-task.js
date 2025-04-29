/* eslint-disable no-console */

import { isDealPage } from '../../../../utils/page-checker';
import { getDealId, getDealStatus } from '../../../../utils/gets';
import { isNumber } from '../../../../../utils/checks';
import { currentUrl } from '../../../../../utils/url-utils';
import { toUrlSearchParams, fetchWithRetry } from '../../../../../utils/helpers';

const { origin, href } = currentUrl;

const getModalTemplate = () => `
  <div id="recode-task-creation-modal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Закрыть окно">
            <span aria-hidden="true">&times;</span>
          </button>
          <h3 class="modal-title">
            <i class="fa fa-check-square" aria-hidden="true"></i> Создание задачи на обработку лида
          </h3>
        </div>
        <div class="modal-body">
          <p>Вы уверены, что хотите создать задачу?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" data-modal="create">Создать задачу</button>
          <button type="button" class="btn btn-default" data-modal="cancel">Закрыть окно</button>
        </div>
      </div>
    </div>
  </div>
`;

const createModal = (onHide) => {
	if (document.querySelector('.recode-modal-container')) {
		return;
	}

	const root = document.createElement('div');
	root.classList.add('recode-modal-container');
	root.innerHTML = getModalTemplate();

	document.body.appendChild(root);

	console.log('create modal');

	if (typeof onHide !== 'function') {
		return;
	}

	// eslint-disable-next-line no-undef
	$('#recode-task-creation-modal').on('hide.bs.modal', onHide);
};

const createTaskElement = (taskTitle) => {
	const node = document.createElement('li');
	node.innerHTML = `<a class="recode-create-task"><i class="glyphicon glyphicon-check"></i> ${taskTitle.trim()}</a>`;

	return node;
};

const createSeparatorElement = () => {
	const node = document.createElement('li');
	node.classList.add('divider', 'operations-widget-search-field__divider');

	return node;
};

const toggleModal = (show) => {
	const modal = document.querySelector('#recode-task-creation-modal');
	if (!modal) {
		return;
	}

	console.log('toggle modal');

	// eslint-disable-next-line no-undef
	$(modal).modal(`${show ? 'show' : 'hide'}`);
};

const hasActiveTask = (parent, title) =>
	[...parent.querySelectorAll('.task-form .task-title > a[href*="/pl/tasks/task/view"]')].some(({ textContent }) =>
		textContent.trim().includes(title.trim())
	);

const shouldAddTask = (taskId, taskTitle, taskProcessTitle) => {
	const isStatusInvalid = ['Завершен', 'Отменен', 'Ложный'].includes(getDealStatus());

	return (
		isDealPage &&
		!isStatusInvalid &&
		(!taskProcessTitle || !hasActiveTask(document, taskProcessTitle)) &&
		!!taskId &&
		isNumber(taskId) &&
		!!taskTitle.trim()
	);
};

const createTask = async (task, signal) => {
	const requestParams = toUrlSearchParams(task);

	try {
		await fetchWithRetry(`${origin}/pl/tasks/task/add`, 1000, 3, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: requestParams,
			signal,
		});

		console.log(`Задача была успешно создана`);

		return true;
	} catch (error) {
		if (error.name === 'AbortError') {
			console.warn('Создание задачи было отменено');
		} else {
			console.error(`Произошла ошибка при создании задачи: ${error.message}`);
		}

		return false;
	}
};

const checkTaskReady = async (taskTitle, signal, delay = 2000, maxTries = 15) => {
	try {
		const parsedPage = await fetchWithRetry(href, delay, 1, { signal })
			.then((response) => response.text())
			.then((htmlString) => new DOMParser().parseFromString(htmlString, 'text/html'));

		const taskIsReady = hasActiveTask(parsedPage, taskTitle);

		if (taskIsReady) {
			return true;
		}

		if (maxTries > 1) {
			await new Promise((resolve) => {
				setTimeout(resolve, delay);
			});

			return checkTaskReady(taskTitle, signal, delay, maxTries - 1);
		}

		return false;
	} catch (error) {
		if (error.name === 'AbortError') {
			console.warn('Проверка задачи была отменена');
		} else if (maxTries > 1) {
			await new Promise((resolve) => {
				setTimeout(resolve, delay);
			});

			return checkTaskReady(taskTitle, signal, delay, maxTries - 1);
		}

		return false;
	}
};

const attachTaskEvent = (taskElement, taskId, taskProccessTitle) => {
	taskElement.addEventListener('click', async (event) => {
		event.preventDefault();

		let cancelButton;
		let confirmButton;
		let handleTaskCreation;
		let handleCancel;

		let abortController;
		let taskCreated = false;

		function onHideModal() {
			confirmButton.removeEventListener('click', handleTaskCreation);
			cancelButton.removeEventListener('click', handleCancel);
			console.log('События сброшены');
		}

		createModal(onHideModal);
		toggleModal(true);

		const taskCreationStatus = document.querySelector('.modal-body p');
		cancelButton = document.querySelector('[data-modal="cancel"]');
		confirmButton = document.querySelector('[data-modal="create"]');

		handleTaskCreation = async () => {
			try {
				confirmButton.disabled = true;
				taskCreationStatus.textContent = 'Задача создается...';

				abortController = new AbortController();
				const { signal } = abortController;

				taskCreated = await createTask(
					{
						missionId: taskId,
						type: 'call',
						objectTypeId: 42,
						objectId: getDealId(),
						title: '',
						description: '',
						startSince: '',
						taskNotifyDelay: '',
						managerUserId: '',
					},
					signal
				);

				if (taskCreated) {
					taskCreationStatus.textContent = `Задача создана, проверяем её появление на странице в течение 30 секунд...`;
					const taskReady = await checkTaskReady(taskProccessTitle, signal);

					if (taskReady) {
						taskCreationStatus.textContent = 'Задача появилась, перезагрузка...';
						setTimeout(() => window.location.reload(), 1500);
					} else {
						taskCreationStatus.textContent =
							'Задача создана, но еще не появилась в карточке или закрылась как дубль. Закройте окно, перезагрузите страницу, выполните проверки или ждите ее появления на странице';
					}
				} else {
					taskCreationStatus.textContent = 'Не удалось создать задачу. Попробуйте снова';
				}
			} catch (error) {
				if (error.name !== 'AbortError') {
					taskCreationStatus.textContent = `Произошла ошибка: ${error.message}`;
				}
			} finally {
				confirmButton.disabled = !taskCreated;
			}
		};

		handleCancel = () => {
			if (abortController) {
				abortController.abort();
			}

			confirmButton.disabled = taskCreated;
			toggleModal(false);
		};

		confirmButton.addEventListener('click', handleTaskCreation);
		cancelButton.addEventListener('click', handleCancel);
	});
};

const initTaskCreation = (tasksData) => {
	const targetNode = document.querySelector('.operations-widget-search-field__divider');
	if (!targetNode) {
		return;
	}

	tasksData.forEach((task) => {
		const { id: taskId, title: taskTitle, proccessTitle: taskProccessTitle } = task;

		if (!shouldAddTask(taskId, taskTitle, taskProccessTitle)) {
			return;
		}

		const taskElement = createTaskElement(taskTitle);
		attachTaskEvent(taskElement, taskId, taskProccessTitle);

		targetNode.after(taskElement);
	});

	const tasks = document.querySelectorAll('.recode-create-task');
	if (!tasks.length) {
		return;
	}

	const separator = createSeparatorElement();
	tasks[tasks.length - 1].after(separator);
};

export default initTaskCreation;
