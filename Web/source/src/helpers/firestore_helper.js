import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

class FirestoreBackend {
  constructor() {

  }

  getUser = (uid = '') => {
    return new Promise((resolve, reject) => {
      firebase.firestore()
        .collection('users')
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            if (doc.data().id == uid) {
              resolve(doc.data());
            }
          })

          reject('User does not exist');
        })
        .catch(error => {
          reject(this._handleError(error));
        })
    })
  }

  getData = (collection = '') => {
    return new Promise((resolve, reject) => {
      firebase.firestore()
        .collection(collection)
        .get()
        .then(snapshot => {
          var data = [];
          snapshot.forEach(doc => {
            var obj = doc.data();
            Object.assign(obj, { id: doc.id });
            data.push(obj);
          })
          resolve(data);
        })
        .catch(error => {
          reject(this._handleError(error));
        })
    })
  }

  setData = (collection = '', act, item) => {
    return new Promise((resolve, reject) => {
      if (act == 'add') {
        firebase.firestore()
          .collection(collection)
          .add(item)
          .then((res) => {
            var itemWithID = { ...item, id: res.id };
            firebase.firestore()
              .collection(collection)
              .doc(res.id)
              .update(itemWithID)
              .then((response) => {
                resolve(res)
              })
              .catch((err) => {
                reject(this._handleError(err));
              })
          })
          .catch(error => {
            reject(this._handleError(error));
          })
      }
      else if (act == 'update') {
        firebase.firestore()
          .collection(collection)
          .doc(item.id)
          .update(item)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(this._handleError(error));
          })
      }
      else if (act == 'delete') {
        firebase.firestore()
          .collection(collection)
          .doc(item.id)
          .delete()
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(this._handleError(error));
          })
      }
    })
  }

  _handleError(error) {
    // var errorCode = error.code;
    var errorMessage = error.message;
    return errorMessage;
  }
}

let _fireStoreBackend = null;

const getFirestoreBackend = () => {
  if (!_fireStoreBackend) {
    _fireStoreBackend = new FirestoreBackend();
  }
  return _fireStoreBackend;
};

export { getFirestoreBackend };
