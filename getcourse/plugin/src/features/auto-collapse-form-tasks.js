const autoСollapseFormTasks = (configTasksLength) => {
	const tasks = document.querySelectorAll('.task-form');
	if (tasks.length > configTasksLength) {
		tasks.forEach((element) => element.classList.add('task-form-closed'));
	}
};

export default autoСollapseFormTasks;
