import { CONFIG } from '../core/config';

export const hasTags = (tagsContainer) => !tagsContainer.querySelector(CONFIG.SELECTORS.NO_TAGS_MARKER);

export const getTags = (tagsContainer) => [...tagsContainer.querySelectorAll(CONFIG.SELECTORS.TAGS_INPUTS)].map((tag) => tag.value);

export const checkPrefix = (tags, prefix) => tags.some((tag) => tag.startsWith(prefix));

const getTagPrefix = (tag) => {
  const separatorIndex = tag.indexOf(CONFIG.TAG_SEPARATOR);
  return separatorIndex !== -1 ? tag.substring(0, separatorIndex) : tag;
};

export const findPrefixConflicts = (tags, excludedPrefixes) => {
  if (tags.length < 2) {
    return [];
  }

  const prefixGroups = new Map();
  const conflictingTags = new Set();

  const normalizedExcluded = excludedPrefixes.map(prefix => prefix.toLowerCase().replace(/_+$/, ''));

  tags.forEach((tag) => {
    const normalizedTag = tag.toLowerCase();
    const prefix = getTagPrefix(normalizedTag);

    if (normalizedExcluded.includes(prefix)) {
      return;
    }

    if (!prefixGroups.has(prefix)) {
      prefixGroups.set(prefix, []);
    }

    prefixGroups.get(prefix).push(tag);
  });

  prefixGroups.forEach((tagsWithSamePrefix) => {
    if (tagsWithSamePrefix.length > 1) {
      tagsWithSamePrefix.forEach((tag) => conflictingTags.add(tag));
    }
  });

  return Array.from(conflictingTags);
};