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
/* end of Firebase Authentication */