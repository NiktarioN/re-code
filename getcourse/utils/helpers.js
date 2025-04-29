import { getValueFromSelect } from "../../utils/gets";

const orderStatusMap = {
  new: 'Новый',
  payed: 'Завершен',
  cancelled: 'Отменен',
  false: 'Ложный',
  in_work: 'В работе',
  payment_waiting: 'Ожидаем оплаты',
  part_payed: 'Частично оплачен',
  waiting_for_return: 'Ожидаем возврата',
  not_confirmed: 'Не подтвержден',
  pending: 'Отложен',
};

const isTargetStatus = (currentStatus, targetStatuses) => targetStatuses.some((status) => status === currentStatus);

const isDealStatusSelected = (selectNode) => getValueFromSelect(selectNode) !== 'Изменить статус';

const isCancelReasonSelected = (selectNode) => getValueFromSelect(selectNode) !== '-- не выбрана --';


export { orderStatusMap, isTargetStatus, isDealStatusSelected, isCancelReasonSelected };