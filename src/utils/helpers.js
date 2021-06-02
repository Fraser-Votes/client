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
