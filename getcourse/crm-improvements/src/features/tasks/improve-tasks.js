import { isUserProfilePage } from '../../config/constants';
import { isDealPage } from '../../../../../utils/page-checker';

const addTaskAttentionBlock = (targetNode, text) => {
	const div = document.createElement('div');
	div.classList.add('recode-crm__attention');
	div.innerHTML = `
  <span class="recode-crm__attention-text">
    <i class="fa-solid fa-circle-exclamation"></i> ${text}
  </span>
  `;

	targetNode.after(div);
};

const improveTasksForms = () => {
	if (!isDealPage && !isUserProfilePage) {
		return;
	}

	const taskNodes = document.querySelectorAll('.task-form .task-title > a[href*="/pl/tasks/task/view"]');
	taskNodes.forEach((node) => {
		const taskForm = node.closest('.task-form');
		const taskParentNode = taskForm?.parentNode;

		if (!taskParentNode || !taskForm) {
			return;
		}

		const taskTitleLowerCase = node.textContent.trim().toLowerCase();

		if (taskTitleLowerCase.includes('[tech]')) {
			addTaskAttentionBlock(
				node,
				'Это техническая задача. Пожалуйста, ничего не нажимайте, если не понимаете что вы делаете'
			);
		}

		if (taskTitleLowerCase.includes('[оп]')) {
			taskForm.classList.add('recode-task-highlight');
			taskForm.classList.remove('task-form-closed');
			addTaskAttentionBlock(node, 'Это важная задача для отдела продаж');
		}
	});
};

export default improveTasksForms;
