import { CONFIG } from '../core/config';
import { MESSAGES } from '../common/messages';
import { createValidationResult } from '../common/validation-result';
import { hasTags, getTags, checkPrefix, findPrefixConflicts } from '../common/tags';

const validateTagsExistence = (tagsContainer) => {
  if (!hasTags(tagsContainer)) {
    return createValidationResult(false, MESSAGES.NO_TAGS);
  }

  return createValidationResult(true);
};

const validatePrefixConflicts = (tags, excludedPrefixes) => {
  const conflictingTags = findPrefixConflicts(tags, excludedPrefixes);

  if (conflictingTags.length) {
    return createValidationResult(false, MESSAGES.PREFIX_CONFLICTS(conflictingTags));
  }

  return createValidationResult(true);
};

const validateRequiredTags = (tags, requiredTags) => {
  if (!requiredTags.length) {
    return createValidationResult(true);
  }

  const missingTags = requiredTags.filter((requiredTag) => !checkPrefix(tags, requiredTag));

  if (missingTags.length) {
    return createValidationResult(false, MESSAGES.MISSING_TAGS(missingTags));
  }

  return createValidationResult(true);
};

export const validateTags = (config) => {
  const { requiredPrefixesTags: requiredTags, excludedPrefixesTags: excludedTags } = config;

  const tagsContainer = document.querySelector(CONFIG.SELECTORS.TAGS_CONTAINER);

  if (!tagsContainer) {
    return createValidationResult(true);
  }

  const existenceResult = validateTagsExistence(tagsContainer);
  if (!existenceResult.success) {
    return existenceResult;
  }

  const tags = getTags(tagsContainer);

  const conflictsResult = validatePrefixConflicts(tags, excludedTags);
  if (!conflictsResult.success) {
    return conflictsResult;
  }

  return validateRequiredTags(tags, requiredTags);
};
