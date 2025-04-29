const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

export { fetchData };