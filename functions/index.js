const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firestore = admin.firestore;
admin.initializeApp;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
class Friends {
  constructor() {
    followers = [];
    following = [];
  }
}

const onUserCreate = functions.auth.user().onCreate((event) => {
  return new Promise((resolve,reject) => {
    const user = event.data;
    const friends = new Friends;
    return firestore.collection('users').doc(user.uid).add(friends).then(e => {
      resolve();
    }).catch(reject);
  });
});