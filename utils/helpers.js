const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const toUrlSearchParams = (obj) => new URLSearchParams(obj).toString();

const fetchWithRetry = async (url, delay, maxTries, options = {}) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response;
  } catch (error) {
    if (maxTries <= 1) {
      throw error;
    }

    await new Promise((resolve) => {
      setTimeout(resolve, delay);
    });

    return fetchWithRetry(url, delay, maxTries - 1, options);
  }
};

const sendPostRequest = async (url, requestParams) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestParams,
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.statusText} (${response.status})`);
    }

    return true;
  } catch (error) {
    console.error(`Ошибка запроса к ${url}: ${error.message}`);
    throw error;
  }
};

export { delay, toUrlSearchParams, fetchWithRetry, sendPostRequest };
