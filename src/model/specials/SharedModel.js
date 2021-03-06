/* global global */
import Model from '../Model';

export const data = {};

export class SharedModel extends Model {
  constructor(value, name) {
    super(null, `@${name}`);
    this.key = `@${name}`;
    this.value = value;
    this.isRoot = true;
    this.root = this;
    this.adaptors = [];
  }

  getKeypath() {
    return this.key;
  }

  retrieve() {
    return this.value;
  }
}

export default new SharedModel(data, 'shared');

export const GlobalModel = new SharedModel(
  typeof global !== 'undefined' ? global : window,
  'global'
);
