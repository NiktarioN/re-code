import settings from '../../config/settings';
import { isEmployee } from "../../../../utils/checks";

const app = (config) => {
  if (!isEmployee) {
    return;
  }

  const configValue = config ?? settings.manageBlockActions;

  document.body.dataset.recodeManageBlockActions = configValue;
}

export default app;