import * as util from 'util';

const u = util as any;
if (!u.isNullOrUndefined) {
  u.isNullOrUndefined = (arg: unknown): boolean => arg === null || arg === undefined;
}
if (!u.isNull) {
  u.isNull = (arg: unknown): boolean => arg === null;
}
if (!u.isUndefined) {
  u.isUndefined = (arg: unknown): boolean => arg === undefined;
}
if (!u.isObject) {
  u.isObject = (arg: unknown): boolean => arg !== null && typeof arg === 'object';
}
if (!u.isString) {
  u.isString = (arg: unknown): boolean => typeof arg === 'string';
}
if (!u.isBoolean) {
  u.isBoolean = (arg: unknown): boolean => typeof arg === 'boolean';
}
if (!u.isNumber) {
  u.isNumber = (arg: unknown): boolean => typeof arg === 'number';
}
if (!u.isFunction) {
  u.isFunction = (arg: unknown): boolean => typeof arg === 'function';
}
if (!u.isSymbol) {
  u.isSymbol = (arg: unknown): boolean => typeof arg === 'symbol';
}
if (!u.isDate) {
  u.isDate = (arg: unknown): boolean => arg instanceof Date;
}
if (!u.isRegExp) {
  u.isRegExp = (arg: unknown): boolean => arg instanceof RegExp;
}
if (!u.isError) {
  u.isError = (arg: unknown): boolean => arg instanceof Error;
}
if (!u.isArray) {
  u.isArray = Array.isArray;
}
if (!u.isBuffer) {
  u.isBuffer = Buffer.isBuffer;
}
