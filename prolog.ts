/**
 * For documenting where Function refers to a class definition
 */
export interface Class extends Function {}

/**
 * Gets Class Metadata - Name
 *
 * @param {Function} klass
 * @return {string}
 */
export function getClassName(klass) {
  return klass.className || klass.name;
}
