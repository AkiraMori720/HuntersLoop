import firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

class FirebaseAuthBackend {
  constructor(firebaseConfig) {    
    if (firebaseConfig) {
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      // firebase.auth().onAuthStateChanged(user => {        
      //   if (user) {
      //     localStorage.setItem("authUser", JSON.stringify(user));
      //   } else {
      //     localStorage.removeItem("authUser");
      //   }
      // });
    }    
  }

  /**
   * Registers the user with given details
   */
 registerUser = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(
          user => {
            resolve(firebase.auth().currentUser);            
          },
          error => {
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * Registers the user with given details
   */
  editProfileAPI = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(
          user => {
            resolve(firebase.auth().currentUser);
          },
          error => {
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * Login user with given details
   */
  loginUser = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(
          user => { 
            resolve(firebase.auth().currentUser);                        
          },
          error => {            
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * forget Password user with given details
   */
  forgetPassword = email => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          resolve(true);
        })
        .catch(error => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * Logout the user
   */
  logout = () => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          resolve(true);
        })
        .catch(error => {
          reject(this._handleError(error));
        });
    });
  };

  setLoggeedInUser = user => {
    localStorage.setItem("authUser", JSON.stringify(user));
  };

  /**
   * Returns the authenticated user
   */
  getAuthenticatedUser = () => {
    if (!localStorage.getItem("authUser")) return null;
    return JSON.parse(localStorage.getItem("authUser"));
  };

  /**
   * Handle the error
   * @param {*} error
   */
  _handleError(error) {
    // var errorCode = error.code;
    var errorMessage = error.message;
    return errorMessage;
  }
}

let _fireBaseBackend = null;

/**
 * Initilize the backend
 * @param {*} config
 */
const initFirebaseBackend = config => {
  if (!_fireBaseBackend) {
    _fireBaseBackend = new FirebaseAuthBackend(config);
  }
  return _fireBaseBackend;
};

/**
 * Returns the firebase backend
 */
const firebaseConfig = {
  apiKey: "AIzaSyDBYm52qfJo0R3apZSqwPrdlbXj9AOvlb8",
  authDomain: "hunter-s-loop.firebaseapp.com",
  databaseURL: "https://hunter-s-loop.firebaseio.com",
  projectId: "hunter-s-loop",
  storageBucket: "hunter-s-loop.appspot.com",
  messagingSenderId: "680066562625",
  appId: "1:680066562625:web:0035b2e2988e26d465e4c0"
};

const getFirebaseBackend = () => {
  // return _fireBaseBackend;
  return initFirebaseBackend(firebaseConfig)
};

export { initFirebaseBackend, getFirebaseBackend };
