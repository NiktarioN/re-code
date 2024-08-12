const parseLocalStorage = {
  getValue: (key) => {
    const data = localStorage.getItem(key);

    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error('Ошибка при парсинге данных:', error);
        return null;
      }
    }

    return null;
  },
};

export default parseLocalStorage;
