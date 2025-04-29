/* eslint-disable no-console */
import { delay, toUrlSearchParams, sendPostRequest } from '../../../../utils/helpers';
import { getProcessData, getObjectList } from '../../../utils/gets';
import { getJsonFromFetch } from '../../../../utils/gets';

const errorMessages = {
  emptyData: 'RE-CODE STUDIO. Плагин gcCrmImprovements. Пустой файл данных процессов, проверьте хостинг.',
};

const getNormalizeProcessesData = (data) =>
  data.map((process) => ({
    ...process,
    'Mission[rule_string]': process['Mission[rule_string]'] ? JSON.stringify(process['Mission[rule_string]']) : '',
    'ParamsObject[is_not_auto_add_managers]': process['ParamsObject[is_not_auto_add_managers]'] || '1',
    'ParamsObject[use_personal_manager]': process['ParamsObject[use_personal_manager]'] || '0',
    'ParamsObject[only_executor_and_supervisor]': process['ParamsObject[only_executor_and_supervisor]'] || '0',
    'Responsible[hide_from_list]': process['Responsible[hide_from_list]'] || '1',
    'Responsible[manager_user_ids]': process['Responsible[manager_user_ids]'] || '',
    'Responsible[supervisor_user_ids]': process['Responsible[supervisor_user_ids]'] || '',
    'ParamsObject[approved]': process['ParamsObject[approved]'] || '0',
    'Mission[start_check_at]': process['Mission[start_check_at]'] || '',
    'Mission[finish_check_at]': process['Mission[finish_check_at]'] || '',
    'ParamsObject[finish_process_at]': process['ParamsObject[finish_process_at]'] || '',
    'tags': process.tags || '',
    'showOnKanban': process.showOnKanban || '0',
  }));

const getCreatedProcesses = async () => {
  const dealProcesses = await getObjectList('/pl/tasks/mission/find-by-type?objectTypeId=42');
  const userProcesses = await getObjectList('/pl/tasks/mission/find-by-type?objectTypeId=41');

  dealProcesses.forEach((process) => {
    // eslint-disable-next-line no-param-reassign
    process.objectType = 'deal';
  });

  userProcesses.forEach((process) => {
    // eslint-disable-next-line no-param-reassign
    process.objectType = 'user';
  });

  return [...dealProcesses, ...userProcesses];
};

const setTagsInProcess = async (process, processId) => {
  const url = `/pl/tag/set-object-tags?objectTypeId=181&objectId=${processId}`;
  const requestParams = toUrlSearchParams({ tags: process.tags });

  try {
    await sendPostRequest(url, requestParams);
    console.log(`Теги в процессе "${process['Mission[title]']}" успешно проставлены`);
  } catch (error) {
    console.error(`Произошла ошибка при установке тегов для процесса "${process['Mission[title]']}": ${error.message}`);
  }
};

const createProcess = async (process) => {
  const url = `/pl/tasks/mission/create`;
  const requestParams = toUrlSearchParams({
    'Mission[title]': process['Mission[title]'],
    'Mission[description]': process['Mission[description]'],
    'Mission[object_type_id]': process['Mission[object_type_id]'],
    'ParamsObject[is_not_auto_add_managers]': process['ParamsObject[is_not_auto_add_managers]'],
  });

  try {
    await sendPostRequest(url, requestParams);
    console.warn(`Процесс "${process['Mission[title]']}" успешно создан`);
  } catch (error) {
    console.error(`Произошла ошибка при выполнении fetch в createProcess: ${error.message}`);
  }
};

const updateProcess = async (process, processId, processLink) => {
  const requestParams = toUrlSearchParams(process);

  try {
    await sendPostRequest(processLink, requestParams);
    if (process.tags) {
      await setTagsInProcess(process, processId);
    }

    console.log(`Процесс "${process['Mission[title]']}" успешно обновлен`);
  } catch (error) {
    console.error(`Произошла ошибка при выполнении fetch в updateProcess: ${error.message}`);
  }
};

const createProcesses = async (processes) => {
  const existingProcesses = await getCreatedProcesses();
  const existingProcessesMap = new Map(existingProcesses.map((process) => [process.name, process]));

  return processes.reduce(
    (promiseChain, process, index) =>
      promiseChain.then(async () => {
        const processTitle = process['Mission[title]'];

        if (existingProcessesMap.has(processTitle)) {
          console.warn(`Процесс "${processTitle}" уже существует. Пропуск создания`);

          return;
        }

        await delay(index * 250);
        await createProcess(process);
        const { link, id } = await getProcessData(processTitle);

        if (link && id) {
          await updateProcess(process, id, link);
        }
      }),
    Promise.resolve()
  );
};

const initCreateProcesses = async () => {
  const processesData = await getJsonFromFetch(
    'https://tech-borodach.pro/packages/getcourse/crm-improvements/data/processes-data.json'
  );

  if (!processesData.length) {
    throw new Error(errorMessages.emptyData);
  }

  const normalizeProcessesData = getNormalizeProcessesData(processesData);

  await createProcesses(normalizeProcessesData);
  console.log('Все процессы были созданы. Перенаправление...');
  window.open('/pl/tasks/mission/all?MissionSearch[title]=[ CRM ]');
};

export default initCreateProcesses;
