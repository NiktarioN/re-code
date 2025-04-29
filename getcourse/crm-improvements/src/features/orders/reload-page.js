import { isDealPage } from '../../../../utils/page-checker';

const reloadOrderPage = () => {
  if (!isDealPage) {
    return;
  }

  let timeoutId;
  const resetTimer = () => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      window.location.reload();
    }, 180000);
  };

  const events = ['mousemove', 'keydown', 'scroll', 'touchstart'];
  events.forEach((event) => {
    window.addEventListener(event, resetTimer);
  });

  resetTimer();
};

export default reloadOrderPage;
