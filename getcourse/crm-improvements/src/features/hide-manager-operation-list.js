import { isCrmPage, isProcessPage } from '../config/constants';
import { isNotEmptyArray } from '../../../../utils/checks';

const hideManagerOperationList = (config) => {
	const managerOperationListSelector = '[name="AutoAssignManagerOperation[managerUserId]"]';
	const taskFormSelector = '.task-form';

	const { idList = [], notMode = false } = config;

	const isTargetUserId = (ids, value) => ids.some((id) => id.toString() === value.toString());

	const hideList = () => {
		const options = document.querySelectorAll(`${managerOperationListSelector} option`);
		options.forEach(({ value, classList }) => {
			const shouldHideOption = notMode ? isTargetUserId(idList, value) : !isTargetUserId(idList, value);
			if (shouldHideOption) {
				classList.add('hide');
			}
		});
	};

	const handleManagerOperationListLoaded = () => {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type !== 'childList') {
					return;
				}

				mutation.addedNodes.forEach((node) => {
					if (
						node.nodeType === 1 &&
						(node.matches('.task-scripts') ||
							node.matches('[data-operation-type="task_auto_assign_manager_operation"]'))
					) {
						hideList();
					}
				});
			});
		});

		observer.observe(document.body, { childList: true, subtree: true });
	};

	if (!isNotEmptyArray(idList) || typeof notMode !== 'boolean') {
		return;
	}

	if (!isCrmPage && !isProcessPage) {
		return;
	}

	if (!document.querySelectorAll(taskFormSelector).length && !isProcessPage) {
		return;
	}

	handleManagerOperationListLoaded();
};

export default hideManagerOperationList;
