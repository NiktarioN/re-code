import { CSS_PREFIX } from "../../config/constants";
import { GLOBAL_CONFIG } from "../../config/config";

export const init = () => {
  if (GLOBAL_CONFIG.hideRightCardComments === true) {
    document.body.classList.add(`${CSS_PREFIX}-hide-right-card-add-comments`)
  }
}