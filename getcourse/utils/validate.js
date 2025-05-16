const validateOfferAddInput = (input) => {
  const rawValue = input.value || '';

  const values = rawValue.split(',').filter(Boolean);
  const uniqueValues = [...new Set(values)];

  input.value = uniqueValues.join(',');

  return uniqueValues;
};

export { validateOfferAddInput };