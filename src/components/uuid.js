/* eslint-disable import/no-mutable-exports */
/* eslint-disable prefer-const */
/* eslint-disable eqeqeq */
/* eslint-disable no-bitwise */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16).toUpperCase();
    },
  );
}

// let uuid = uuidfun();

export default uuid();