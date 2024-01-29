// TODO:

/**
 * Plugin Name: gcEmployeesAssignments
 * Description: Права для сотрудников на GetCourse
 * Version: 1.0
 */

import setConfig from './config/config';
import hideMoneyInformation from './modules/hide-money-information';

window.recode = {
	...(window.recode || {}),
	gcEmployeesAssignments: {
		init(options = {}) {
			if (this.config) {
				throw new Error(
					'RE-CODE STUDIO. Плагин gcEmployeesAssignments. Повторная инициализация функционала невозможна'
				);
			}

			this.config = setConfig(options);
			const { employees } = this.config;
			const { notAccessPage } = this.config;

			const targetEmployee = Object.keys(employees).find((employee) => employee === window?.accountUserId.toString());
			if (!targetEmployee) {
				return;
			}

			const assignments = employees[targetEmployee];

			if (assignments?.hideMoneyInformation === true) {
				hideMoneyInformation(notAccessPage);
			}
		},
	},
};
