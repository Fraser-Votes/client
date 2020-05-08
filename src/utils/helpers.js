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