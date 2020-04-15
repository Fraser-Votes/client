import firebase from "gatsby-plugin-firebase"

export const pageView = (title) => {
    firebase.analytics().setCurrentScreen(title)
    firebase.analytics().logEvent('page_view')
}