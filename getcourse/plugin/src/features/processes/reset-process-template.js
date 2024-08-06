import { isProcessesCreatePage } from '../../../../../utils/page-checker';

const resetProcessTemplate = () => {
	if (!isProcessesCreatePage) {
		return;
	}

	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach(() => {
				const targetNode = document.querySelector('select[name="Mission[process_id]"]');
				if (!targetNode) {
					return;
				}

				targetNode.value = '';
			});
		});
	});

	observer.observe(document.body, { childList: true, subtree: true });
};

export default resetProcessTemplate;
