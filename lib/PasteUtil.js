import {
  isObject,
  isString
} from 'min-dash';


/**
 * A factory function that returns a reviver to be
 * used with JSON#parse to reinstantiate moddle instances.
 *
 * @param { import('moddle') } moddle
 *
 * @return {Function}
 */
export function createReviver(moddle) {

  const elementCache = {};

  /**
   * The actual reviewer that creates model instances
   * for elements with a $type attribute.
   *
   * Elements with ids will be re-used, if already
   * created.
   *
   * @param  {String} key
   * @param  {Object} object
   *
   * @return {Object} actual element
   */
  return function(key, object) {

    if (isObject(object) && isString(object.$type)) {

      const { id } = object;

      if (id && elementCache[ id ]) {
        return elementCache[ id ];
      }

      const type = object.$type;

      const attrs = Object.assign({}, object);

      delete attrs.$type;

      const descriptor = moddle.getTypeDescriptor(type);

      if (!descriptor) {
        return;
      }

      const newElement = moddle.create(type, attrs);

      if (id) {
        elementCache[ id ] = newElement;
      }

      return newElement;
    }

    return object;
  };
}