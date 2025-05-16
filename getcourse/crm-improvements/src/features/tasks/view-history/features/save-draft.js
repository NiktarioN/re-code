import { normalizeSpaces } from '../../../../../../../utils/helpers';
import { updateLocalSetting } from '../../../../modules/local-settings-manager';
import { CONFIG } from '../core/config';

const saveDraft = (textarea) => {
  const text = normalizeSpaces(textarea.value);
  updateLocalSetting(CONFIG.SETTINGS_PATH.DRAFT_COMMENT, text);
};

const setupDraftSaving = (modal, textarea) => {
  modal.setOnClose(() => {
    saveDraft(textarea);
  });
};

export default setupDraftSaving;
