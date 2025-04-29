const isNumber = (value) => !Number.isNaN(Number(value));
const isNotEmptyArray = (inputArray) => Array.isArray(inputArray) && inputArray.length;
const isMobile = window.innerWidth <= 575;
const isDeviceWidthLessThan1200 = window.innerWidth <= 1200;

const isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const checkTargetPage = (inputArray) => inputArray.some((item) => item);

const objectAlreadyAdded = (comparisonMap, inputObject) => comparisonMap.has(inputObject.label || inputObject.name);

export { isNumber, isNotEmptyArray, isDeviceWidthLessThan1200, isMobile, checkTargetPage, objectAlreadyAdded, isJson };
