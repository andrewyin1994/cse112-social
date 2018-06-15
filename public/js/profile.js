const user = firebase.auth().currentUser;
const name, email, photoUrl, uid, emailVerified;

if(user != null){
    name = user.displayName;
    email = user.email;
    photoUrl = user.photoURL;
    emailVerified = user.emailVerified;
    uid = user.uid;
}

// This is for get UserName
function getUserName(){
    firestore.collection('users').doc(firebase.auth().currentUser.uid).get().then(function(snapshot){
        console.log(snapshot.data().name);
    });
}

// This is for get email
function getUserEmail(){
    console.log(user.email);
}

// This is for the fucntion that user can reset the password
function resetPassword(){
    firebase.auth().confirmPasswordReset(code, newPassword)
    .then(function() {
      // Success
    })
    .catch(function() {
      // Invalid code
    })
}

