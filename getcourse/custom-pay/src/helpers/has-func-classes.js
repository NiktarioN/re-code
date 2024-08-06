import { keyFuncClasses } from '../config/constants';

const hasFuncClasess = (form) => {
  const mainFormBlock = form.closest('.lt-form');
  const offers = form.querySelectorAll('[name="formParams[offer_id][]"]');
  if (!mainFormBlock || !offers.length) {
    return false;
  }

  return keyFuncClasses.some(className => className.)
};

const checkFuncClasses = (element) => {
  return keyFuncClasses.some(className => {
    element.closest('.lt-form').classList.
  })
}
export default hasFuncClasess;
