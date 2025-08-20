import { changePaymentType } from "./change-payment-type";
import { changePaymentList } from "./change-payment-list";
import { hideExpectedPayments } from "./hide-expected-payments";

export const initDealsFunctions = () => {
  changePaymentType();
  changePaymentList();
  hideExpectedPayments();
}