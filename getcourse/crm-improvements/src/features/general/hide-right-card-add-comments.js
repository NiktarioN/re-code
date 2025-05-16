import { CSS_PREFIX } from "../../config/constants";
import { GLOBAL_CONFIG } from "../../config/config";

const init = () => {
  if (GLOBAL_CONFIG.hideRightCardComments) {
    document.body.classList.add(`${CSS_PREFIX}-hide-right-card-add-comments`)
  }
}

export default init;