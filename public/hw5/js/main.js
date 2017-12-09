const txtEmail=document.getElementById('user');const txtPassword=document.getElementById('password');const btnLogin=document.getElementById('btnLogin');const btnSignUp=document.getElementById('btnSignUp');const btnLogout=document.getElementById('btnLogout');function clearStorage(){window.localStorage.clear();return!0}
function verifyLogin(){usr=document.loginForm.user.value;pwd=document.loginForm.password.value;if(usr=='usr'){if(pwd=='pwd'){window.location.href="team.html";return!0}
return!1}
else{console.log("wrong");return!1}}
function logOut(){firebase.auth().signOut();window.location.href="home.html";return!0}
function clearStorage(){window.localStorage.clear();return!0}
window.addEventListener("DOMContentLoaded",function(){if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').then(function(registration){console.log('Registration successful, scope is:',registration.scope)}).catch(function(error){console.log('Service worker registration failed, error:',error)})}})