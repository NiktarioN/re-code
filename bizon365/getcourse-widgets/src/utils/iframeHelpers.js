import { CONFIG } from "../core/config";

const scrollToElement = (element, offset = 0) => {
  try {
    if (!element.offsetParent) {
      return;
    }

    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const targetPosition = Math.max(0, elementPosition - offset);

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  } catch (error) {
    console.warn('Ошибка скролла:', error);
  }
};

export const generateRandomIframeClass = () =>
  Math.floor(Math.random() * (CONFIG.MAX_RANDOM_CLASS - CONFIG.MIN_RANDOM_CLASS + 1)) + CONFIG.MIN_RANDOM_CLASS;

const heightStabilityTrackers = new Map();

const handleDelayedScroll = (element, expectedHeight, offset, attemptsLeft = CONFIG.MAX_SCROLL_ATTEMPTS) => {
  if (attemptsLeft <= 0) {
    scrollToElement(element, offset);
    return;
  }

  const actualHeight = element.offsetHeight;

  if (actualHeight >= expectedHeight && element.offsetParent) {
    scrollToElement(element, offset);
    return;
  }

  setTimeout(
    () => handleDelayedScroll(element, expectedHeight, offset, attemptsLeft - 1),
    CONFIG.SCROLL_ATTEMPT_INTERVAL
  );
};

export const updateIframeHeight = (container, iframe, height, shouldScroll = false, scrollTarget = null, scrollOffset = 0) => {
  if (!container || !iframe) {
    return;
  }

  const numericHeight = parseInt(height, 10);

  if (!numericHeight || numericHeight <= 0) {
    return;
  }

  const isInitialLoad = iframe.style.height === '' || iframe.style.height === '0px';
  iframe.style.height = `${numericHeight}px`;

  if (!shouldScroll) {
    return;
  }

  const elementToScroll = scrollTarget || iframe;
  const iframeId = iframe.id;

  if (heightStabilityTrackers.has(iframeId)) {
    clearTimeout(heightStabilityTrackers.get(iframeId));
  }

  const stabilityTimeout = setTimeout(() => {
    if (isInitialLoad) {
      handleDelayedScroll(elementToScroll, numericHeight, scrollOffset);
    } else {
      setTimeout(() => scrollToElement(elementToScroll, scrollOffset), CONFIG.SCROLL_DELAY);
    }

    heightStabilityTrackers.delete(iframeId);
  }, CONFIG.HEIGHT_STABILITY_DELAY);

  heightStabilityTrackers.set(iframeId, stabilityTimeout);
};
