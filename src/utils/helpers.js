/**
 * Sort array of objects by key
 * @param {any[]} array
 * @param {string} key
 * @returns {any[]}
 */
export const sortByKey = (array, key) => array.sort((a, b) => {
  const x = a[key]; const y = b[key];
  return ((x < y) ? 1 : ((x > y) ? -1 : 0));
});

/**
 * Asynchronously enumerate children of `snapshot`
 * @param {firebase.database.DataSnapshot} snapshot
 * @param {Function} callback
 * @returns {Promise<Array>} Array of results of callback
 */
export const snapshotMap = (snapshot, callback) => {
  const promises = [];
  snapshot.forEach((child) => {
    promises.push(callback(child));
  });
  return Promise.all(promises);
};

/**
 * Asynchronously iterates over an array
 * @param {array} array
 * @param {Function} callback
 */
export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index, array);
  }
};
/**
 * Chunks an array into N arrays of a given size. Useful for firebase batch ops
 * @param {array} arr 
 * @param {number} chunkSize 
 * @returns 
 */
export const chunk = (arr, chunkSize) => {
  // eslint-disable-next-line no-throw-literal
  if (chunkSize <= 0) throw 'Invalid chunk size';
  const R = [];
  for (let i = 0, len = arr.length; i < len; i += chunkSize) R.push(arr.slice(i, i + chunkSize));
  return R;
};
