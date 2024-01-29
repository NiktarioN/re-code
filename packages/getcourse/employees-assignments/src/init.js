/**
 * Plugin Name: gcEmployeesAssignments
 * Description: Права для сотрудников на GetCourse
 * Author: RE-CODE STUDIO
 * Author URL: https://techeducation.ru/y/8bbf221
 */

(() => {
	const intervalId = setInterval(() => {
		if (window?.recode?.gcEmployeesAssignments) {
			clearInterval(intervalId);
			// Инициализируем функционал и прописываем настройки
			window.recode.gcEmployeesAssignments.init({
				employees: {
					999999: {
						hideMoneyInformation: true,
					},
					777777: {
						hideMoneyInformation: true,
					},
				},
				notAccessPage: '/not-access-page',
			});
		}
	}, 100);
})();
