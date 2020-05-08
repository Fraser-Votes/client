/**
 * Sort array of objects by key
 * @param {any[]} array
 * @param {string} key
 * @returns {any[]}
 */
export const sortByKey = (array, key) => {
  return array.sort(function (a, b) {
    var x = a[key]; var y = b[key];
    return ((x < y) ? 1 : ((x > y) ? -1 : 0));
  });
}

/**
 * Asynchronously enumerate children of `snapshot`
 * @param {firebase.database.DataSnapshot} snapshot
 * @param {Function} callback
 * @returns {Promise<Array>} Array of results of callback
 */
export const snapshotMap = (snapshot, callback) => {
  const promises = []
  snapshot.forEach(child => {
    promises.push(callback(child))
  })
  return Promise.all(promises)
}
