import { navigate } from "@reach/router"
import firebase from "gatsby-plugin-firebase"

/**
 * Determines whether or not the app is in SSR
 * @returns {Boolean} Is the app running in a browser or not
 */
export const isBrowser = () => typeof window !== "undefined"

/**
 * Gets  the current user from LocalStorage
 * @returns {User<JSON>} Firebase auth user object
 */
export const getUser = () => 
  isBrowser() && window.localStorage.getItem("user")
    ? JSON.parse(window.localStorage.getItem("user"))
    : {}


/**
 * Sets user object into LocalStorage
 * @param {firebase.auth.user} user
 */
export const setUser = user => {
  isBrowser() && window.localStorage.setItem("user", JSON.stringify(user))
  if (isBrowser() && user.email) {
    firebase.firestore().collection("users").doc(user.email.split("@")[0]).get().then((res) => {
      window.localStorage.setItem("isAdmin", res.data().admin)
    })
  }
}

/**
 * Determines auth state of user
 * @returns {Boolean} User login status
 */
export const isLoggedIn = () => {
  const user = getUser()
  return !!user.email
}

/**
 * Determines admin state of user
 * @returns {Boolean} User admin status
 */
export const isAdmin = () => 
  isBrowser() && window.localStorage.getItem("isAdmin")
    ? JSON.parse(window.localStorage.getItem("isAdmin"))
    : false

/**
 * Logs the current user out
 * @param {firebase} firebase
 * @returns {Promise} Resolves a promise once logged out
 */
export const logout = firebase => {
  return new Promise(resolve => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        setUser({})
        navigate(`/app/login`)
        resolve()
      })
  })
}
