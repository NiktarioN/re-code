const addScript = () => {
  const script = document.createElement('script');
  script.dataset.scriptName = 'Кастомная сумма оплаты';
  script.dataset.author = 're-code studio (tg: @recode_solutions)';
  script.src = `https://tech-borodach.pro/packages/getcourse/custom-pay/index.js?v=${new Date()
    .getTime()
    .toString()
    .slice(0, 10)}`;

  document.body.appendChild(script);
};

document.addEventListener('DOMContentLoaded', () => {
  addScript();
});