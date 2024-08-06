import { isEmployee } from '../../../utils/checks';

const hideUnavailableTrainings = () => {
	if (isEmployee || window?.recode?.hideTrainings !== 1) {
		return;
	}

	const trainings = document.querySelectorAll('.stream-table tr');
	const trainingsToHide = [...trainings].filter(
		(training) => training.classList.contains('no-lessons') || training.classList.contains('noaccess-mode-show')
	);

	trainingsToHide.forEach((training) => {
		training.classList.add('hide');
	});

	if (trainings.length === trainingsToHide.length) {
		const noContentMessage = document.createElement('h3');
		noContentMessage.textContent = 'Нет доступных тренингов';
		document.querySelector('.stream-table')?.appendChild(noContentMessage);
	}
};

export default hideUnavailableTrainings;
