import { isDealPage } from '../../../../../utils/page-checker';
import { getDealId, getDealStatus } from '../../../../utils/gets';
import { isNumber } from '../../../../../utils/checks';

const createOrderTask = ({
	id: taskId = undefined,
	title: taskTitle = undefined,
	proccessTitle: taskProccessTitle = undefined,
}) => {
	const hasTask = (title) =>
		[...document.querySelectorAll('.task-form .task-title > a[href*="/pl/tasks/task/view"]')].some(({ textContent }) =>
			textContent.trim().includes(title.trim())
		);

	const createTask = async (params) => {
		const formData = new FormData();
		Object.entries(params).forEach(([key, value]) => formData.append(key, value));

		try {
			const response = await fetch(`${window.origin}/pl/tasks/task/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams(formData).toString(),
			});

			if (response.ok) {
				window.location.reload();
			} else {
				throw new Error('Произошла ошибка при выполнении fetch:', response.statusText);
			}
		} catch (error) {
			throw new Error(`Произошла ошибка при выполнении fetch:', ${error.message}`);
		}
	};

	const targetNode = document.querySelector('.operations-widget-search-field__divider');
	const needAddTask =
		isDealPage &&
		!!targetNode &&
		!(getDealStatus() === 'Завершен') &&
		!(getDealStatus() === 'Отменен') &&
		!(getDealStatus() === 'Ложный') &&
		(taskProccessTitle === undefined || !hasTask(taskProccessTitle)) &&
		!!taskId &&
		isNumber(taskId) &&
		!!taskTitle.trim();

	if (!needAddTask) {
		return;
	}

	const taskLi = document.createElement('li');
	taskLi.innerHTML = `<a href=""><i class="glyphicon glyphicon-check"></i> ${taskTitle.trim()}</a>`;

	taskLi.addEventListener('click', (event) => {
		event.preventDefault();

		createTask({
			missionId: taskId,
			type: 'call',
			objectTypeId: 42,
			objectId: getDealId(),
			title: '',
			description: '',
			startSince: '',
			taskNotifyDelay: '',
			managerUserId: window?.accountUserId || '',
		});
	});

	targetNode.after(taskLi);
};

export default createOrderTask;
