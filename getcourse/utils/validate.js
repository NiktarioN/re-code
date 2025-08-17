const validateOfferAddInput = (input) => {
  const rawValue = input.value || '';

  const values = rawValue.split(',').filter(Boolean);
  const uniqueValues = [...new Set(values)];
  const newValue = uniqueValues.join(',');

  if (input.value !== newValue) {
    input.value = newValue;
  }

  return uniqueValues;
};

const validateOfferSelection = (offerField) => {
  if (!offerField) {
    return false;
  }

  const offers = validateOfferAddInput(offerField);
  return offers.length > 0;
};

export { validateOfferAddInput, validateOfferSelection };