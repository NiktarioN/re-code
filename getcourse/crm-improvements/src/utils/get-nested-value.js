const getNestedValue = (obj, path) => path.split('.').reduce((acc, key) => acc?.[key], obj);

export default getNestedValue;
