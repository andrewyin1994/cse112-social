/*
Goal:
Add functionality for at least 5 features:
1) login
2) logout
3) scheduling
4) roster
5) statistics

useful:
https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
use localStorage, which is a built-in object in the browser/webAPI/ that allows you to store key value pairs,
use it to store arrays of objects or whatever kind of data you need
(key k: value v, v can be any kind of thing, even an array[])
sessionStorage is stored until the browser session ends
*/

/* Firebase Aunthetication */
// not under one function??
// initialize Firebase
var config = {
    apiKey: "AIzaSyD2KbGQQLhhapSRQCa9y3cden7rmSL28tM",
    authDomain: "cse134gahuyi.firebaseapp.com",
    databaseURL: "https://cse134gahuyi.firebaseio.com",
    projectId: "cse134gahuyi",
    storageBucket: "cse134gahuyi.appspot.com",
    messagingSenderId: "741715887321"
};
firebase.initializeApp(config);

const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
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

// Logout button
btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
});
// Real time listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    // checks if user exists
    if(firebaseUser) {
        console.log(firebaseUser);
    } else {
        console.log('not logged in');
    }
});
/* end of Firebase Authentication */

function clearStorage() {
    window.localStorage.clear();
    return true;
}

// function test() {
//     //show current localStorage
//     console.log(window.localStorage);

//     //example in appending
//     var tmp = {'usr': 'pwd'};
//     console.log(tmp);
//     tmp['dog']='cat';
//     console.log(tmp);


//     window.localStorage['login'] = JSON.stringify(tmp);
//     console.log(window.localStorage['login']);
//     var out = JSON.parse(window.localStorage['login']);
//     console.log(tmp);
// }

// function test2() {
//     //grab the current username and password
//     usr = document.loginForm.user.value;
//     pwd = document.loginForm.password.value;
//     if(usr=='usr') {
//         window.location.href = "team.html";
//         return true;
//     }
//     else {
//         console.log("wrong");
//         //alert("wrong");
//         return false;
//     }

// }

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
    window.location.href = "home.html";
    return true;
}

