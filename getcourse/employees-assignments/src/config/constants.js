import { currentUrl } from '../../../../utils/url-utils';

const defaultNotAccessPage = '/teach/control/stream';
const workSections = {
	dealPages: ['/pl/sales/deal', '/pl/sales/control/payment'],
	traffic: ['/pl/metrika/traffic', '/pl/stat/channel/index', '/pl/stat/charge/index', '/pl/metrika/cohort/report'],
	statistic: ['/user/control/user/statistic', '/pl/sales/dealstat/index'],
	cms: {
		editor: ['/pl/cms/page'],
	},
};

const checkPage = (pages) => pages.some((page) => currentUrl.pathname.includes(page));

const isDealPage = checkPage(workSections.dealPages);
const isTrafficPage = checkPage(workSections.traffic);
const isStatisticPage = checkPage(workSections.statistic);

export { defaultNotAccessPage, isDealPage, isTrafficPage, isStatisticPage };
