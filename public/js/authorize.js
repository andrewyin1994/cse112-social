const txtEmail = document.getElementById('username');
const txtPassword = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById('btnSignUp');
const btnLogout = document.getElementById('btnLogout');

const testInsert = document.getElementById('testInsert');

// Login button
btnLogin.addEventListener('click', e => {
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();

  const promise = auth.signInWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));

  testInsert.innerHTML = "login works";
});

// Sign Up button
btnSignUp.addEventListener('click', e => {
  // need for email verification
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();

  const promise = auth.createUserWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));


  testInsert.innerHTML = "signup works";
});

// Real time listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  // checks if user exists
  if (firebaseUser) {
    console.log(firebaseUser);
    testInsert.innerHTML = "signed in as: " + firebaseUser.email;
    //window.location.href = "team.html";
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


    testInsert.innerHTML = "sign out works";
  }).catch(function (error) {
    // An error happened.
  });
});

/* end of Firebase Authentication */