/**
 * Преобразует kebab-case в camelCase
 * @param {string} str - строка в kebab-case
 * @returns {string} строка в camelCase
 * @example toCamelCase('my-component') → 'myComponent'
 */
export const toCamelCase = (str) => str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());

/**
 * Преобразует camelCase в kebab-case
 * @param {string} str - строка в camelCase
 * @returns {string} строка в kebab-case
 * @example toKebabCase('myComponent') → 'my-component'
 */
export const toKebabCase = (str) => str.replace(/([A-Z])/g, '-$1').toLowerCase();

/**
 * Преобразует kebab-case в PascalCase
 * @param {string} str - строка в kebab-case
 * @returns {string} строка в PascalCase
 * @example toPascalCase('my-component') → 'MyComponent'
 */
export const toPascalCase = (str) => {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

/**
 * Преобразует kebab-case в snake_case
 * @param {string} str - строка в kebab-case
 * @returns {string} строка в snake_case
 * @example toSnakeCase('my-component') → 'my_component'
 */
export const toSnakeCase = (str) => str.replace(/-/g, '_');