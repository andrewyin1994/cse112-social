const txtEmail = document.getElementById('user');
const txtPassword = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById('btnSignUp');
const btnLogout = document.getElementById('btnLogout');

// Login button
btnLogin.addEventListener('click', e => {
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();

  const promise = auth.signInWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));
});

// Sign Up button
btnSignUp.addEventListener('click', e => {
  // need for email verification
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();

  const promise = auth.createUserWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));
});

// Real time listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  // checks if user exists
  if(firebaseUser) {
      console.log(firebaseUser);  
      window.location.href = "team.html";
  } else {
      console.log('not logged in');
  }
});

btnLogout.addEventListener('click', function(){
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();
  const currentUser = firebase.auth().currentUser;
  firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log(currentUser + "signed out");

    }).catch(function(error) {
      // An error happened.
    });
});

/* end of Firebase Authentication */

/* Sign Up modal */
function activateSignUp() {
  // initialize modal element
  var modalEl = document.createElement('div');
  modalEl.style.width = '400px';
  modalEl.style.height = '300px';
  modalEl.style.margin = '100px auto';
  modalEl.style.backgroundColor = '#fff';

  modalEl.innerHTML = "Hello";

  // show modal
  mui.overlay('on', modalEl);
}
/* end of Sign Up modal */