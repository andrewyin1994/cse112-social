btnLogin.addEventListener('click',e=>{const email=txtEmail.value;const pass=txtPassword.value;const auth=firebase.auth();const promise=auth.signInWithEmailAndPassword(email,pass);promise.catch(e=>console.log(e.message))});btnSignUp.addEventListener('click',e=>{const email=txtEmail.value;const pass=txtPassword.value;const auth=firebase.auth();const promise=auth.createUserWithEmailAndPassword(email,pass);promise.catch(e=>console.log(e.message))});firebase.auth().onAuthStateChanged(firebaseUser=>{if(firebaseUser){console.log(firebaseUser);window.location.href="team.html"}else{console.log('not logged in')}})