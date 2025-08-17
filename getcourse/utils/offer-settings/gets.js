export const getOfferPrice = () => {
  const priceInput = document.querySelector('[name="Offer[price]"]');
  return priceInput ? parseFloat(priceInput.value) || 0 : 0;
};