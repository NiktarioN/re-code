import { isUserGroupControlPage, isGroupControlPage, isTrainingTreeEditPage } from '../../../../../utils/page-checker';

const getSettingsBlock = () => {
	const root = document.createElement('div');
	root.classList.add('recode-collapse-expand');
	root.innerHTML = `
    <button class="recode-collapse-expand__button" data-toggle="expand">Развернуть папки</button>
  `;

	return root;
};

const toggleCollapseExpand = (nodesSelector, action) => {
	const nodes = document.querySelectorAll(nodesSelector);
	nodes.forEach((node) => {
		const isNotEmptyFolder = [...node.children].some(
			(child) => child.tagName.toLowerCase() === 'button' && child.dataset.action
		);

		if (isNotEmptyFolder) {
			node.classList.toggle('dd-collapsed', action === 'collapse');
		}

		const buttonsCollapse = node.querySelectorAll('button[data-action="collapse"]');
		const buttonsExpand = node.querySelectorAll('button[data-action="expand"]');

		buttonsCollapse.forEach(($button) => {
			const button = $button;
			button.style.display = action === 'collapse' ? 'none' : 'block';
		});

		buttonsExpand.forEach(($button) => {
			const button = $button;
			button.style.display = action === 'collapse' ? 'block' : 'none';
		});
	});
};

const addToggleCollapseExpand = ({ collapseUserGroups }) => {
	const isWorkPage = [isUserGroupControlPage, isGroupControlPage, isTrainingTreeEditPage].some(Boolean);
	if (!isWorkPage) {
		return;
	}

	if (isUserGroupControlPage && collapseUserGroups) {
		document.querySelector('.folder-collapse')?.click();
	}

	toggleCollapseExpand('.dd-item', 'collapse');
	const settingsBlock = getSettingsBlock();

	const toggleButton = settingsBlock.querySelector('[data-toggle]');
	toggleButton.addEventListener('click', (event) => {
		event.preventDefault();
		const action = toggleButton.dataset.toggle;
		toggleCollapseExpand('.dd-item', action);
		toggleButton.dataset.toggle = action === 'collapse' ? 'expand' : 'collapse';
		toggleButton.textContent = action === 'collapse' ? 'Развернуть папки' : 'Свернуть папки';
	});

	const getAppendNodeSelector = () => {
		if (isGroupControlPage) {
			return '.col-md-8 > .dd';
		}
		if (isTrainingTreeEditPage) {
			return '.col-md-6 > .trainings-tree';
		}
		return null;
	};
	const appendNode = document.querySelector(getAppendNodeSelector());

	if (appendNode) {
		appendNode.before(settingsBlock);
	}
};

export default addToggleCollapseExpand;
