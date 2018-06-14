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
    //firestore's set() needs an object to do so
    this.follow = {
      followerRefs: [],
      followingRefs: [],
      followerCount: 0,
      openToSearch: false,
      name:"",
      email:"",
      city:"",
      description:"",
      avatarUrl:""
    }
  }
}

exports.onUserCreate = functions.auth.user().onCreate((user) => {
  console.log('User Created', user.uid);
  return new Promise((resolve,reject) => {
    const friends = new Friends();
    // firestore.collection('users').doc(user.uid).set(  friends);
    return admin.firestore().collection('users').doc(user.uid)
      .set( friends.follow )
      .then(e => { resolve(); }, e => { reject(); });
  });
});