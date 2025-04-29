/**
 * Plugin Name: return-value
 * Description: Получаем значение указанного параметра
 * Author: RE-CODE AGENCY
 * Author URL: https://techeducation.ru/y/8bbf221
 */

app.get('/', (ctx, req) => {
  const { param } = req.query;

  if (!param) {
    return '';
  }

  return param;
});