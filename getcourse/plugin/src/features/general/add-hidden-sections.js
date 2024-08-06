import { isSalesSettingsPage, isCmsSettingsPage, isProcessesEditorPage } from '../../../../../utils/page-checker';
import { isEmployee } from '../../../../utils/checks';

const menuData = {
	salesSettings: [{ title: 'Причины отказа', url: '/pl/list-value/index?objectType=14' }],
	cmsSettings: [
		{ title: 'Темы', url: '/pl/cms/layout' },
		{ title: 'Переменные', url: '/pl/cms/user-vars' },
		{ title: 'Сократить ссылку', url: '/pl/cms/link/create' },
	],
	processesSettings: [{ title: 'API', url: '/pl/saas/account/api' }],
};

const createMenuItem = ({ url, title, itemClass, linkClass }) => {
	const node = document.createElement('li');
	if (itemClass) {
		node.classList.add(itemClass);
	}

	const link = document.createElement('a');
	if (linkClass) {
		link.classList.add(linkClass);
	}
	link.href = url;
	link.textContent = title;
	node.appendChild(link);

	return node;
};

const addMenuItems = () => {
	if (!isEmployee) {
		return;
	}

	const pageMenu = document.querySelector('.standard-page-menu, .page-menu');
	const { salesSettings, cmsSettings, processesSettings } = menuData;
	let newItemsMenuList = [];

	if (isSalesSettingsPage) {
		newItemsMenuList = [...newItemsMenuList, ...salesSettings];
	}
	if (isCmsSettingsPage) {
		newItemsMenuList = [...newItemsMenuList, ...cmsSettings];
	}
	if (isProcessesEditorPage) {
		newItemsMenuList = [...newItemsMenuList, ...processesSettings];
	}

	const newItemsMenu = newItemsMenuList.map(createMenuItem);
	newItemsMenu.forEach((item) => pageMenu?.appendChild(item));
};

export default addMenuItems;
