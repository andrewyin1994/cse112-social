const txtEmail = document.getElementById('username');
const txtPassword = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const btnSignUpForm = document.getElementById('btnSignUpForm');
const btnLogout = document.getElementById('btnLogout');
const googleLogin = document.getElementById('googleLogin');
const testInsert = document.getElementById('testInsert');

const DEBUG = true;

// Login button
btnLogin.addEventListener('click', e => {
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();

  const promise = auth.signInWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));

  // testInsert.innerHTML = "login works";
});

googleLogin.addEventListener('click', e => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    console.log("Google Success", token, user);
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    console.log("Google Failure", email, credential, errorCode, errorMessage)
  });
});

// Activate sign-up function
btnSignUpForm.addEventListener('click', activateSignUp);

// Cancel Function
function cancelFunc() {
  mui.overlay('off');
}

// Sign Up Function
function submitFunc() {
  const muser = document.getElementById('muser').value;
  const mpass = document.getElementById('mpass').value;
  const cpass = document.getElementById('cpass').value;
  const emailerr = document.getElementById('emailerr');
  const passerr = document.getElementById('passerr');
  const matcherr = document.getElementById('matcherr');
  // const auth = firebase.auth();

  // clear any warning messages
  emailerr.innerHTML = passerr.innerHTML = matcherr.innerHTML = '';

  // warn user for non-matching password on signup
  if (!(mpass === cpass)) {
    matcherr.innerHTML = 'Passwords do not match.';
  }
  else {
    firebase.auth().createUserWithEmailAndPassword(muser, mpass).then(
      function(currentUser) {
        // Sign-up successful.
        console.log(currentUser,  "signed Up");

        // close the dialog box upon successful sign-up
        mui.overlay('off');

        // testInsert.innerHTML = "sign up works";
      },
      function (error) {
        let errorCode = error.code;
        let errorMessage = error.message;

        console.log(errorCode);

        if (errorCode == 'auth/invalid-email') {
          emailerr.innerHTML = errorMessage;
        }
        if (errorCode == 'auth/weak-password') {
          passerr.innerHTML = errorMessage;
        }
      });
  }
}

// Real time listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  // checks if user exists
  if (firebaseUser) {
    console.log('fbUser', firebaseUser, '.');
    // testInsert.innerHTML = "signed in as: " + firebaseUser.email;
    if(firebaseUser.metadata.a === firebaseUser.metadata.b) {
      window.location.href = 'profile.html';
    }
    else {
    window.location.href = "homepage.html";
    }
  } else {
    console.log('not logged in');
  }
});

btnLogout.addEventListener('click', function () {
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();
  const currentUser = firebase.auth().currentUser;
  firebase.auth().signOut().then(function () {
    // Sign-out successful.
    console.log(currentUser + "signed out");

    // testInsert.innerHTML = "sign out works";
  }).catch(function (error) {
    console.log(error.message);
  });
});

/* end of Firebase Authentication */

/* Sign Up modal */
function activateSignUp() {
  // initialize modal element
  var modalEl = document.createElement('div');
  modalEl.style.width = '28em';
  modalEl.style.height = '28em';
  modalEl.style.margin = '100px auto';
  modalEl.style.backgroundColor = '#fff';
  
  modalEl.innerHTML = `<div class='mui-container-fluid' style='padding-top: 3em;'>` + `<div class='mui-row'>` + `<div class='mui-col-md-8 mui-col-md-offset-2'>` +
    `<form class='mui-form'>
  <legend>Sign Up</legend>
  <div class='mui-textfield mui-textfield--float-label'>
    <input type='text' name='muser' id='muser'>
    <label for='muser'>Email</label>
  </div>
  <p id='emailerr' style='color:red;'></p>

  <div class='mui-textfield mui-textfield--float-label'>
    <input type='password' name='mpass' id='mpass'>
    <label for='mpass'>Password</label>
  </div>
  <p id='passerr' style='color:red;'></p>

  <div class='mui-textfield mui-textfield--float-label'>
    <input type='password' name='cpass' id='cpass'>
    <label for='cpass'>Confirm Password</label>
  </div>
  <p id='matcherr' style='color:red;'></p>
</form> 
<button type='submit' class='mui-btn mui-btn--raised' id='btnSignUp' onclick='submitFunc()'>Submit</button>
<button type='cancel' class='mui-btn mui-btn--raised' id='btncancel' onclick='cancelFunc()'>Cancel</button>
</div></div></div>`;

  // show modal
  mui.overlay('on', modalEl);
}
/* end of Sign Up modal */
