const txtEmail = document.getElementById('username');
const txtPassword = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const btnSignUpForm = document.getElementById('btnSignUpForm');
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

btnSignUpForm.addEventListener('click', activateSignUp);

// Sign Up Function
function submitFunc() {
  const muser = document.getElementById('muser').value;
  const mpass = document.getElementById('mpass').value;
  const cpass = document.getElementById('cpass').value;
  const auth = firebase.auth();

  /* @issue verify mpass == cpass on firebase */

  firebase.auth().createUserWithEmailAndPassword(muser, mpass).then(function(currentUser) {
    // Sign-out successful.
    console.log(currentUser + "signed Up");
    mui.overlay('off');

    testInsert.innerHTML = "sign Up works";
  }, function(error) {
    console.log(error.message);
  });
}

// Real time listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  // checks if user exists
  if (firebaseUser) {
    console.log(firebaseUser);
    testInsert.innerHTML = "signed in as: " + firebaseUser.email;
    window.location.href = "homepage.html";
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

/* Sign Up modal */
function activateSignUp() {
  // initialize modal element
  var modalEl = document.createElement('div');
  modalEl.style.width = '400px';
  modalEl.style.height = '300px';
  modalEl.style.margin = '100px auto';
  modalEl.style.backgroundColor = '#fff';

  modalEl.innerHTML = 
    "<form class='mui-form'>" +
      "<legend>Title</legend>" + 
      "<div class='mui-textfield mui-textfield--float-label'>" +
        "<input type='text' name='muser' id='muser'>" +
        "<label for='muser'>Email</label>" +
      "</div>" +
      "<div class='mui-textfield mui-textfield--float-label'>" +
        "<input type='password' name='mpass' id='mpass'>" +
        "<label for='mpass'>Password</label>" +
      "</div>" +
      "<div class='mui-textfield mui-textfield--float-label'>" +
        "<input type='password' name='cpass' id='cpass'>" +
        "<label for='cpass'>Confirm Password</label>" +
      "</div>" +
    "</form> " +
    "<button type='submit' class='mui-btn mui-btn--raised' id='btnSignUp' onclick='submitFunc()'>Submit</button>";

  // show modal
  mui.overlay('on', modalEl);
}
/* end of Sign Up modal */