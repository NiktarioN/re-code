/* eslint-disable no-console */
import { delay, toUrlSearchParams, sendPostRequest } from '../../../../utils/helpers'
import { getObjectList } from '../../../utils/gets';
import { getJsonFromFetch } from '../../../../utils/gets';

const errorMessages = {
  emptyData: 'RE-CODE STUDIO. Плагин gcCrmImprovements: пустой файл данных процессов. Возможно, ошибка с хостингом',
  createError: (reason) => `Ошибка при создании причины отказа "${reason}"`,
  fetchError: (method) => `Ошибка в ${method} при выполнении fetch`,
  alreadyExists: (reason) => `Причина отказа "${reason}" уже существует. Пропуск создания`,
};

const successMessages = {
  created: (reason) => `Причина отказа "${reason}" успешно создана`,
};

const createCancelReason = async (reasonData) => {
  const url = `/pl/list-value/create?objectType=14`;
  const requestParams = toUrlSearchParams({
    'CancelReason[title]': reasonData['CancelReason[title]'],
    'CancelReason[order_pos]': reasonData['CancelReason[order_pos]'],
  });

  try {
    await sendPostRequest(url, requestParams);
    console.log(successMessages.created(reasonData['CancelReason[title]']));
  } catch (error) {
    console.error(errorMessages.createError(reasonData['CancelReason[title]']), error.message);
  }
};

const createCancelReasons = async (reasons) => {
  const existingReasons = await getObjectList('/pl/list-value/models?objectType=14');
  const existingReasonsMap = new Map(existingReasons.map((reason) => [reason.name, reason]));

  return reasons.reduce(
    (promiseChain, reason, index) =>
      promiseChain.then(async () => {
        const reasonTitle = reason['CancelReason[title]'];

        if (existingReasonsMap.has(reasonTitle)) {
          console.warn(errorMessages.alreadyExists(reasonTitle));

          return;
        }

        await delay(index * 250);
        await createCancelReason(reason);
      }),
    Promise.resolve()
  );
};

const initCreateCancelReasons = async () => {
  const cancelReasonsData = await getJsonFromFetch(
    'https://tech-borodach.pro/packages/getcourse/crm-improvements/data/cancel-reasons-data.json'
  );

  if (!cancelReasonsData.length) {
    throw new Error(errorMessages.emptyData);
  }

  await createCancelReasons(cancelReasonsData);
  console.log('Все причины отказа были созданы');
};

export default initCreateCancelReasons;