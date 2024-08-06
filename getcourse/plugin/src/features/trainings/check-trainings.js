import { isTrainingModulesPage } from '../../../../../utils/page-checker';

const checkTrainings = () => {
	if (!isTrainingModulesPage) {
		return;
	}

	const links = document.querySelectorAll('tr.training-row a');
	links.forEach((link) => {
		const url = link.getAttribute('href');

		fetch(url, { method: 'HEAD', redirect: 'follow' })
			.then((response) => {
				if (response.redirected) {
					link.closest('tr').classList.add('recode-not-buyed');
				}
			})
			.catch((error) => {
				// eslint-disable-next-line no-console
				console.error('Ошибка при запросе:', error);
			});
	});
};

export default checkTrainings;
