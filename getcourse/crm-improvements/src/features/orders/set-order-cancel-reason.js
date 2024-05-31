import { isDealPage } from '../../../../../utils/page-checker';
import { getDealStatus } from '../../../../utils/gets';

const setOrderCancelReason = () => {
	if (!isDealPage) {
		return;
	}

	const targetStatuses = ['Отменен', 'Ложный'];
	const orderChangeStatusNode = document.querySelector('[name="Deal[change_status]"]');
	const canselReasonNode = document.querySelector('[name="Deal[cancel_reason_id]"]');
	const canselReasonNodeParentNode = canselReasonNode?.closest('.deal-state-panel');

	if (!orderChangeStatusNode || !canselReasonNode || canselReasonNode.options.length <= 1) {
		return;
	}

	const getValueFromSelect = ({ selectedIndex, options }) =>
		selectedIndex >= 0 ? options[selectedIndex].textContent.trim() : null;

	const getSelectedOrderStatus = () => getValueFromSelect(orderChangeStatusNode);

	const isTargetStatus = (currentStatus) => targetStatuses.some((status) => status === currentStatus);
	const isOrderStatusNotSelected = (selectNode) => getValueFromSelect(selectNode) === 'Изменить статус';
	const isCancelReasonNotSelected = (selectNode) => getValueFromSelect(selectNode) === '-- не выбрана --';

	const createAllertBlock = () => {
		const div = document.createElement('div');
		div.classList.add('recode-crm__attention', 'hide');
		div.innerHTML = `
    <span class="recode-crm__attention-text">
      <i class="fa-solid fa-circle-exclamation"></i> Укажи причину отказа в блоке ниже
    </span>
    `;

		return div;
	};

	const showAlert = () => {
		const currentOrderStatus = getDealStatus();
		const selectedOrderStatus = getSelectedOrderStatus();

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

	const handleHover = (allertBlockInput) => {
		if (!showAlert()) {
			return;
		}

		allertBlockInput.classList.remove('hide');
		// eslint-disable-next-line
		alert('Нельзя отменять или удалять заказ, не указав причину отказа');

		canselReasonNodeParentNode.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	};

	const allertBlock = createAllertBlock();
	canselReasonNode.before(allertBlock);

	const buttons = document.querySelectorAll('.page-actions button.btn-primary, [name="save"]');
	buttons.forEach((button) =>
		button.addEventListener('mouseenter', () => {
			handleHover(allertBlock);
		})
	);
};

export default setOrderCancelReason;
