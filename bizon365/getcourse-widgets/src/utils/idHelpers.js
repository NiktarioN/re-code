import { CONFIG } from "../core/config";

export const generateRandomId = () =>
  Math.random()
    .toString(36)
    .slice(2, CONFIG.ID_LENGTH + 2);