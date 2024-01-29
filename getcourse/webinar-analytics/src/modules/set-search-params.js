// TODO
// 1. Продумать концепцию когда мы убираем из текстовой версии ссылки ненужные параметры
// 2. Продумать как сделать так, чтобы метки в ссылках в вебинарной комнате тоже прописывались
// 3. Продумать что делать с сокращенными ссылками, которые и так в себе содержат параметры
// 4. Сделать настройку, чтобы на конкретной странице можно было отключить пропись меток в ссылки (через window)
// 5. Добавить обратный режим, который работает так, что нужно прописывать, где будет работать перенос меток
// 6. Проверить скрипт для Taplink
// 7. Сделать так, чтобы если в кнопках было больше параметров, чем в url, то они бы удалялись

import { valueSetAttribute, defaultSearchParams } from '../config/constants';
import { getAllSearchParams, addSearchParams, removeSearchParams } from '../../../utils/url-utils';

const setSearchParamsInElements = (searchParams) => {
	const workElements = [
		{
			elementSelector: 'a[href]',
			elementAttributeLink: 'href',
		},
	];

	const setSearchParams = (element, elementAttribute) => {
		[...document.querySelectorAll(`${element}:not([${valueSetAttribute}])`)]
			.filter((filteredElement) => /^(https?:\/)?\/.+/i.test(filteredElement.getAttribute(elementAttribute)))
			.forEach((filteredElement) => {
				let url = filteredElement.getAttribute(elementAttribute);

				const filteredElementSearchParams = defaultSearchParams.filter((defaultSearchParam) =>
					[...getAllSearchParams(url).keys()].some((linkSearchParam) => defaultSearchParam === linkSearchParam)
				);

				if (filteredElementSearchParams.length > searchParams.length) {
					url = removeSearchParams(url, defaultSearchParams).href;
				}
				url = addSearchParams(url, searchParams);

				const { href, origin, pathname, search, hash } = url;
				filteredElement.setAttribute(
					elementAttribute,
					window.location.origin === origin ? `${pathname}${search}${hash}` : href
				);
				filteredElement.setAttribute(valueSetAttribute, '');
			});
	};

	const initSetSearchParams = () => {
		workElements.forEach(({ elementSelector: element, elementAttributeLink: elementAttribute }) =>
			setSearchParams(element, elementAttribute, searchParams)
		);
	};
	initSetSearchParams(searchParams);

	setInterval(() => {
		initSetSearchParams(searchParams);
	}, 1000);
};

export default setSearchParamsInElements;
