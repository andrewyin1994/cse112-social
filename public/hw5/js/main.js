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

// // Logout button
// btnLogout.addEventListener('click', e => {
//     firebase.auth().signOut();
// });
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
/* end of Firebase Authentication */

function clearStorage() {
    window.localStorage.clear();
    return true;
}

function verifyLogin() {
    //grab the current username and password
    usr = document.loginForm.user.value;
    pwd = document.loginForm.password.value;
    if(usr=='usr') {
        if(pwd=='pwd'){
            window.location.href = "team.html";
            return true;
        }
        return false;
    }
    else {
        console.log("wrong");
        return false;
    }

}

/* old logout */
function logOut() {
    firebase.auth().signOut();
    window.location.href = "home.html";
    return true;
}

function clearStorage() {
    window.localStorage.clear();
    return true;
}

window.addEventListener("DOMContentLoaded", function() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
        .then(function(registration) {
            console.log('Registration successful, scope is:', registration.scope);
        })
        .catch(function(error) {
            console.log('Service worker registration failed, error:', error);
        });
    }
});