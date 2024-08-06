import { isDealPage } from '../../../../utils/page-checker';
import { getDealStatus } from '../../../utils/gets';

const hideExpectedPayments = () => {
	if (!isDealPage) {
		return;
	}
	const targetStatuses = ['Завершен'];
	const currentStatus = getDealStatus();
	const isTargetStatus = targetStatuses.some((status) => status === currentStatus);
	if (!isTargetStatus) {
		return;
	}

	const expectedPayments = document.querySelectorAll(
		'.payments-table tr td:nth-child(3) option[selected="selected"][value="expected"]'
	);
	expectedPayments.forEach((node) => node.closest('tr').classList.add('hide'));
};

export default hideExpectedPayments;
