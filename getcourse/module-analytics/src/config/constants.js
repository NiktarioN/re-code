import { currentUrl, hasSearchParam } from '../../../../utils/url-utils';

const defaultSearchParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const ignoreSearchParams = ['id'];
const dontResetSearchParams = ['sb_id', 'sbid', 'bh_id', 'bhid', 'vk_id', 'vkid'];

// const ignoreSearchParamInLessons = ['id', 'mode'];
// const getcourseWorkSections = ['page', 'show', 'control/stream', 'control/lesson'];
const getcourseWorkSections = ['page', 'show'];
const workPages = {
	offerSettings: ['/pl/sales/offer/update', '/pl/sales/offer/create'],
	userDealsPage: ['/sales/control/userProduct/my'],
	cms: {
		editor: ['/pl/cms/page'],
	},
};
const isOfferSettingsPage = workPages.offerSettings.some((page) => currentUrl.pathname.includes(page));
const isUserDealsPage = workPages.userDealsPage.some((page) => currentUrl.pathname.includes(page));
const isEditorPage =
	workPages.cms.editor.some((page) => currentUrl.pathname.includes(page)) ||
	hasSearchParam(currentUrl.href, 'editMode');

const isFramed = window.self !== window.top;
const isGetcourseWorkPage = getcourseWorkSections.some((section) => window?.controllerId === section);

const valueManuallyClasses = ['recode-value-', 'recode-text-', 'recode-param-', 'recode-cookie-'];

const valueSetAttribute = 'data-recode-value-set';
const urlModeOptions = {
	full: true,
	clean: false,
};

const formsSelector = 'form.lt-form';
const offerSelector = '[name="formParams[offer_id][]"]';
const formCreateDealSelector = '.recode-form-create-deal';

const { isAdmin, isTeacher } = window.userInfo;
const isEmployee = isAdmin || isTeacher;

export {
	defaultSearchParams,
	ignoreSearchParams,
	dontResetSearchParams,
	valueSetAttribute,
	urlModeOptions,
	isFramed,
	isEditorPage,
	isGetcourseWorkPage,
	isOfferSettingsPage,
	isUserDealsPage,
	formsSelector,
	offerSelector,
	formCreateDealSelector,
	isEmployee,
	valueManuallyClasses,
};
