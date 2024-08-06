const isNumber = (value) => !Number.isNaN(Number(value));
const isNotEmptyArray = (inputArray) => Array.isArray(inputArray) && inputArray.length;
const isMobile = window.innerWidth <= 575;
const isDeviceWidthLessThan1200 = window.innerWidth <= 1200;

const checkTargetPage = (inputArray) => inputArray.some((item) => item);

export { isNumber, isNotEmptyArray, isDeviceWidthLessThan1200, isMobile, checkTargetPage };
