import { navigate } from "@reach/router"
import firebase from "gatsby-plugin-firebase"

export const isBrowser = () => typeof window !== "undefined"

export const getUser = () =>
  isBrowser() && window.localStorage.getItem("user")
    ? JSON.parse(window.localStorage.getItem("user"))
    : {}

export const setUser = user => {
  isBrowser() && window.localStorage.setItem("user", JSON.stringify(user))
  if (isBrowser() && user.email) {
    firebase.firestore().collection("users").doc(user.email.split("@")[0]).get().then((res) => {
      window.localStorage.setItem("isAdmin", res.data().admin)
    })
  }
}

export const isLoggedIn = () => {
  const user = getUser()
  return !!user.email
}

export const isAdmin = () => 
  isBrowser() && window.localStorage.getItem("isAdmin")
    ? JSON.parse(window.localStorage.getItem("isAdmin"))
    : false

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
