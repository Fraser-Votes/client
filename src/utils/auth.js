import { navigate } from '@reach/router';
import firebase from 'gatsby-plugin-firebase';

/**
 * Determines whether or not the app is in SSR
 * @returns {Boolean} Is the app running in a browser or not
 */
export const isBrowser = () => typeof window !== 'undefined';

/**
 * Gets the current user from LocalStorage
 * @returns {User<JSON>} Firebase auth user object
 */
export const getUser = () => (isBrowser() && window.localStorage.getItem('user')
  ? JSON.parse(window.localStorage.getItem('user'))
  : {});


/**
 * Sets user object into LocalStorage
 * @param {firebase.auth.user} user
 */
export const setUser = async (user) => {
  if (isBrowser()) {
    window.localStorage.setItem('user', JSON.stringify(user));
    if (user.email) {
      try {
        const res = await firebase.firestore().collection('users').doc(user.email.split('@')[0]).get();
        window.localStorage.setItem('isAdmin', res.data().admin || false);
      } catch (err) {
        navigate('/authentication_error');
      }
    }
  }
};

/**
 * Determines auth state of user
 * @returns {Boolean} User login status
 */
export const isLoggedIn = () => {
  const user = getUser();
  return !!user.email;
};

/**
 * Determines admin state of user
 * @returns {Boolean} User admin status
 */
export const isAdmin = () => (isBrowser() && window.localStorage.getItem('isAdmin')
  ? JSON.parse(window.localStorage.getItem('isAdmin'))
  : false);

/**
 * Logs the current user out
 * @param {firebase} _firebase
 * @returns {Promise} Resolves a promise once logged out
 */
export const logout = (_firebase) => new Promise((resolve) => {
  _firebase
    .auth()
    .signOut()
    .then(() => {
      setUser({});
      navigate('/app/login');
      resolve();
    });
});
