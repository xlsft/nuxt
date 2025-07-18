/**
 * ## utils/prototype
 * Checks if a given value matches a specified type by using the `Object.prototype.toString` method.
 *
 * This utility allows you to verify the type of a value, offering a reliable way to determine the internal `[[Class]]` of the object. It works well for identifying built-in types like `Array`, `Object`, `Date`, etc.
 *
 * ```ts
 * const isArray = prototype([], 'Array'); // true
 * const isDate = prototype(new Date(), 'Date'); // true
 * const isNumber = prototype(new Number(42), 'Number'); // true
 * ```
 *
 * @param o The value to be checked.
 * @param type The type to check against, such as `'Array'`, `'Object'`, `'Date'`, etc.
 *
 * @return `true` if the value matches the specified type; otherwise, `false`.
 */
export const prototype = (o: unknown, type: string): boolean => Object.prototype.toString.call(o) === `[object ${type}]`;