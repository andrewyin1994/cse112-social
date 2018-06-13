const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
class Friends {
  constructor() {
    this.followers = [];
    this.following = [];
  }
}

// console.log(functions.auth.user());

exports.onUserCreate = functions.auth.user().onCreate((user) => {
  console.log('User Created', user.uid);
  const friends = new Friends();
  // firestore.collection('users').doc(user.uid).set(  friends);
  admin.firestore().collection('users').doc(user.uid).set({ 'test': 'test' });
});