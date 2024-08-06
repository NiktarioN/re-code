// Дождаться загрузки блока на странице задачи
// Проверить указано ли значение. Если нет, то кнопки неактивны. Если есть, то делаем кнопки активными
// Если кнопка есть кнопка вернуться назад, то на нее disabled не вешаем
// Если написан комментарий, но при этом не выбрана причина отказа, то появляется блок с подсказкой

import { hasFormTask } from '../../../../utils/checks';
import { isDealPage } from '../../../../../utils/page-checker';
import { getDealStatus } from '../../../../utils/gets';

const targetStatuses = ['Отменен', 'Ложный'];

const getValueFromSelect = ({ selectedIndex, options }) =>
	selectedIndex >= 0 ? options[selectedIndex].textContent.trim() : null;

const isTargetStatus = (currentStatus) => targetStatuses.some((status) => status === currentStatus);

const isOrderStatusNotSelected = (selectNode) => getValueFromSelect(selectNode) === 'Изменить статус';

const isCancelReasonNotSelected = (selectNode) => getValueFromSelect(selectNode) === '-- не выбрана --';

const createAlertBlock = () => {
	const div = document.createElement('div');
	div.classList.add('recode-crm__attention', 'hide');
	div.innerHTML = `
  <span class="recode-crm__attention-text">
    <i class="fa-solid fa-circle-exclamation"></i> Выбери причину отказа в блоке ниже
  </span>
  `;

	return div;
};

const isComeBackButton = (button) => button.textContent.trim().toLowerCase().includes('вернуться назад');

const disableButtons = (button) => {
	if (!isComeBackButton(button)) {
		// eslint-disable-next-line no-param-reassign
		button.disabled = true;
	}
};

const handleHover = (alertBlock, canselReasonNodeParentNode, showAlert) => {
	if (!showAlert()) {
		return;
	}

	alertBlock.classList.remove('hide');
	// eslint-disable-next-line
	alert('Нельзя отменять или удалять заказ, не указав причину отказа');

	canselReasonNodeParentNode.scrollIntoView({
		behavior: 'smooth',
		block: 'start',
	});
};

const setOrderCancelReasonCommon = (isFormTask) => {
	const orderChangeStatusNode = document.querySelector(
		isFormTask ? '[name="ChangeStatusOperation[status]"]' : '[name="Deal[change_status]"]'
	);
	const canselReasonNode = document.querySelector(
		isFormTask ? '[name="ChangeStatusOperation[cancel_reason_id]"]' : '[name="Deal[cancel_reason_id]"]'
	);
	const canselReasonCommentNode = isFormTask
		? document.querySelector('[name="ChangeStatusOperation[cancel_reason_comment]"]')
		: null;
	const resultButtons = isFormTask
		? document.querySelectorAll('.task-form .results-block .btn')
		: document.querySelectorAll('.page-actions button.btn-primary, [name="save"]');

	if (!orderChangeStatusNode || !canselReasonNode || canselReasonNode.options.length <= 1) {
		return;
	}

	const canselReasonNodeParentNode =
		canselReasonNode.closest('.deal-state-panel') || canselReasonNode.closest('.form-task');
	const alertBlock = createAlertBlock();
	canselReasonNode.before(alertBlock);

	const showAlert = () => {
		const currentOrderStatus = getDealStatus();
		const selectedOrderStatus = getValueFromSelect(orderChangeStatusNode);

		return (
			(isTargetStatus(currentOrderStatus) &&
				isTargetStatus(selectedOrderStatus) &&
				isCancelReasonNotSelected(canselReasonNode)) ||
			(isTargetStatus(currentOrderStatus) &&
				isOrderStatusNotSelected(orderChangeStatusNode) &&
				isCancelReasonNotSelected(canselReasonNode)) ||
			(!isTargetStatus(currentOrderStatus) &&
				isTargetStatus(selectedOrderStatus) &&
				isCancelReasonNotSelected(canselReasonNode))
		);
	};

	if (isFormTask) {
		const needDisableTask = () => {
			const selectedOrderStatus = getValueFromSelect(orderChangeStatusNode);

			return isTargetStatus(selectedOrderStatus) && isCancelReasonNotSelected(canselReasonNode);
		};

		const disableTask = () => {
			resultButtons.forEach(disableButtons);
			alertBlock.classList.remove('hide');
		};

		const activeTask = () => {
			resultButtons.forEach((button) => {
				// eslint-disable-next-line no-param-reassign
				button.disabled = false;
			});
			alertBlock.classList.add('hide');
		};

		if (needDisableTask()) {
			disableTask();
		}

		orderChangeStatusNode.addEventListener('change', () => {
			if (needDisableTask()) {
				disableTask();
			} else {
				activeTask();
			}
		});

		canselReasonNode.addEventListener('change', () => {
			if (!isCancelReasonNotSelected(canselReasonNode)) {
				activeTask();
			}
		});
	} else {
		resultButtons.forEach((button) =>
			button.addEventListener('mouseenter', () => {
				handleHover(alertBlock, canselReasonNodeParentNode, showAlert);
			})
		);
	}
};

const handleTaskOrderCancelReason = () => {
	const observer = new MutationObserver(() => {
		const node = document.querySelector('[name="ChangeStatusOperation[status]"]');
		if (!node) {
			return;
		}

		setOrderCancelReasonCommon(true);
	});

	document.querySelectorAll('.task-form').forEach((node) => {
		observer.observe(node, { childList: true, subtree: true });
	});
};

const setOrderCancelReason = () => {
	if (isDealPage) {
		setOrderCancelReasonCommon(false);
	}

	if (hasFormTask) {
		// handleTaskOrderCancelReason();
	}
};

export default setOrderCancelReason;
