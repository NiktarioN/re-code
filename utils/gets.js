const getParsedPage = async (url) => {
  const document = await fetch(url)
    .then((data) => data.text())
    .then((htmlString) => new DOMParser().parseFromString(htmlString, 'text/html'))
    .catch(() => null);

  return document;
};

const getJsonFromFetch = async (url) => {
  const json = await fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('failed getJsonFromFetch');
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error.message);
      return [];
    });

  return json;
};

const getValueFromSelect = ({ selectedIndex, options }) =>
  selectedIndex >= 0 ? options[selectedIndex].textContent.trim() : null;

export { getParsedPage, getJsonFromFetch, getValueFromSelect };
