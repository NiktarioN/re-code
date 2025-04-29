import { isMailingSettingsPage } from '../../../../utils/page-checker';

const setCheckbox = (selector) => {
  const checkbox = document.querySelector(selector);
  if (checkbox && !checkbox.checked) {
    checkbox.click();
  }
};

const setMailingSettings = () => {
  if (!isMailingSettingsPage) {
    return;
  }

  const saveButton = document.querySelector('.btn-save-mailing');
  if (!saveButton) {
    return;
  }

  // Настройка "Отправлять всем"
  const sendAllCheckBox = document.querySelector('#ParamsObject_send_to_0');
  if (sendAllCheckBox && !sendAllCheckBox.checked) {
    sendAllCheckBox.checked = true;
    sendAllCheckBox.closest('.mailing-params')?.classList.add('hide');
  }

  // Ставим галочку в настройке "Оборачивать ссылки для учета кликов"
  setCheckbox('[name="ParamsObject[click_wrap_links]"]');
  // Ставим галочку в настройке "Оборачивать ссылки для авторизации"
  setCheckbox('[name="ParamsObject[wrap_links]"]');
  // Ставим галочку в настройке "Скрывать превью ссылок"
  setCheckbox('[name="ParamsObject[disable_links_preview]"]');
};

export default setMailingSettings;
