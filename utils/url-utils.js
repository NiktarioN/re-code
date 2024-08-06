const currentUrl = new URL(window.location.href);

const isUrl = (value) => {
  try {
    const url = new URL(value);
    return Boolean(url);
  } catch (error) {
    return false;
  }
};

const normalizeUrl = (inputUrl) => new URL(inputUrl, currentUrl.origin);

const hasSearchParam = (inputUrl, searchParam) => normalizeUrl(inputUrl).searchParams.has(searchParam);

const getSearchParamValue = (inputUrl, searchParam) => normalizeUrl(inputUrl).searchParams.get(searchParam);

const hasSearchParamValue = (inputUrl, searchParam) => Boolean(getSearchParamValue(inputUrl, searchParam));

const getAllSearchParams = (inputUrl) => {
  const url = normalizeUrl(inputUrl);

  return new URLSearchParams(url.search);
};

const getFilteredSearchParams = (inputUrl, searchParams = []) => {
  const url = normalizeUrl(inputUrl);
  const search = new URLSearchParams(url.search);
  const filteredSearchParams = [...search].filter(([param]) =>
    searchParams.some((searchParam) => param === searchParam)
  );

  return new URLSearchParams(filteredSearchParams);
};

const addSearchParams = (inputUrl, searchParams = []) => {
  const url = normalizeUrl(inputUrl);
  searchParams.forEach(([param, value]) => {
    url.searchParams.set(param, value);
  });

  return url;
};

const removeSearchParams = (inputUrl, searchParams = []) => {
  const url = normalizeUrl(inputUrl);
  [...(typeof searchParams === 'string' ? [searchParams] : searchParams)].forEach((param) => {
    url.searchParams.delete(param);
  });

  return url;
};

const updateUrl = ({ href, origin, pathname, search, hash }) =>
  window.location.origin === origin ? `${pathname}${search}${hash}` : href;

export {
  currentUrl,
  isUrl,
  normalizeUrl,
  hasSearchParam,
  getSearchParamValue,
  hasSearchParamValue,
  getAllSearchParams,
  getFilteredSearchParams,
  addSearchParams,
  removeSearchParams,
  updateUrl,
};
