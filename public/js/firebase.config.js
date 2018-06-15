try {
  const config = {
    apiKey: "AIzaSyB66GZ37bvTX0t7y2k16ixM0cI_vHlp6C8",
    authDomain: "cse112sb.firebaseapp.com",
    databaseURL: "https://cse112sb.firebaseio.com",
    projectId: "cse112sb",
    storageBucket: "cse112sb.appspot.com",
    messagingSenderId: "299405505457"
  };
  firebase.initializeApp(config);
} catch (e) {
  console.log('=========Firebase firestore initializer==============')
  console.log(e)
  console.log('====================================')
}

const firestore = firebase.firestore();
const fbauth = firebase.auth;
const fbref = firebase.database().ref();