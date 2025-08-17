// @shared
import { jsx } from '@app/html-jsx';
import CreateOrderPage from './pages/create-order-page.vue';

// Экспортируем API роуты
export { offersListRoute } from './api/offers';
// export { managersListRoute } from './api/managers';
// export { configRoute } from './api/config';
// export { paymentMethodsRoute } from './api/payment-methods';
// export { getUserByEmailRoute } from './api/users';
// export { createOrderRoute } from './api/orders';

// Главная страница
export const indexPageRoute = app.get('/', async (ctx, req) => {
	return (
		<html>
			<head>
				<title>Создание заказа - GetCourse</title>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8f8f8;
            color: #333;
            line-height: 1.6;
          }

          input, select, button {
            font-family: inherit;
          }https://docstarclub.ru/pl/logic/funnel/dashboard?id=1611050#pk=alltime

          button:focus, input:focus, select:focus {
            outline: 2px solid #007bff;
            outline-offset: 2px;
          }
        `}</style>
			</head>
			<body>
				<CreateOrderPage />
			</body>
		</html>
	);
});
