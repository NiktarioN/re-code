import { valueSetAttribute, defaultSearchParams } from '../../config/constants';
import { getAllSearchParams, addSearchParams, removeSearchParams, updateUrl } from '../../../../../utils/url-utils';

const setSearchParamsInElements = (searchParams) => {
	const workElements = [
		{
			elementSelector: 'a[href]',
			elementAttributeLink: 'href',
		},
		{
			elementSelector: 'form[data-success-url]',
			elementAttributeLink: 'data-success-url',
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

				filteredElement.setAttribute(elementAttribute, updateUrl(url));
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
