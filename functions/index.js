const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

class User {
  constructor(user) {
    //firestore's set() will only accept an Object 
    this.info = {
      followerRefs: [],
      followingRefs: [],
      followerCount: 0,
      openToSearch: false,
      name: 'Anonymous User',
      email: user.email,
      title: 'New User',
      description: '',
      avatarUrl: ''
    }
  }
}

exports.onUserCreate = functions.auth.user().onCreate((firebaseUser) => {
  console.log('User Created', firebaseUser.uid);
  return new Promise((resolve,reject) => {
    const newUser = new User(firebaseUser);
    // firestore.collection('users').doc(user.uid).set(  friends);
    return admin.firestore().collection('users').doc(firebaseUser.uid)
      .set( newUser.info )
      .then(e => { resolve(); }, e => { reject(); });
  });
});