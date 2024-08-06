import { getTag } from '../../../../utils/gets';
import { createSetting } from '../../../../utils/create';

const addSettingСlass = (settingObj) => {
	const { parentNode, targetNodeSelector, settingСlass, settingLabel, settingCss = null } = settingObj;

	const targetNode = parentNode.querySelector(targetNodeSelector);
	if (!targetNode) {
		return;
	}

	const setting = createSetting(settingСlass, settingLabel);
	if (settingCss) {
		setting.style.cssText += settingCss;
	}
	targetNode.after(setting);

	const checkbox = setting.querySelector('input');
	const tagEditor = parentNode.querySelector('.tag-editor');
	const targetTag = getTag(tagEditor, '.tag-editor-tag', settingСlass);
	checkbox.checked = !!targetTag;

	checkbox.addEventListener('change', ({ target: { checked } }) => {
		if (!checked) {
			const tagToDelete = getTag(tagEditor, '.tag-editor-tag', settingСlass);
			tagToDelete?.parentNode?.querySelector('.tag-editor-delete')?.click();
		}

		if (checked) {
			tagEditor.click();

			const tagValueInput = tagEditor.lastElementChild?.querySelector('input');
			if (tagValueInput) {
				tagValueInput.value = settingСlass;
			}

			tagEditor.click();
			tagEditor.blur();
		}
	});

	tagEditor.addEventListener('click', ({ target }) => {
		if (!target.closest('.tag-editor-delete')) {
			return;
		}

		if (target.closest('.tag-editor-delete').parentNode.querySelector('.tag-editor-tag').textContent === settingСlass) {
			checkbox.checked = false;
		}
	});

	const tagEditorObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type !== 'childList') {
				return;
			}

			mutation.addedNodes.forEach((addedNode) => {
				if (addedNode.nodeType === 1 && !!getTag(tagEditor, '.tag-editor-tag', settingСlass)) {
					checkbox.checked = true;
				}
			});
		});
	});

	tagEditorObserver.observe(tagEditor, { childList: true, subtree: true });
};

export default addSettingСlass;
