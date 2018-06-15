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

<<<<<<< HEAD
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

=======
editProfile.addEventListener('click', editProfileForm);

function editProfileForm() {
    // initialize modal element
    var modalEl = document.createElement('div');
    modalEl.style.width = '40em';
    modalEl.style.height = '40em';
    modalEl.style.margin = '10em auto';
    modalEl.style.backgroundColor = '#fff';
  
    modalEl.innerHTML = `<div class='mui-container-fluid' style='padding-top: 3em;'>` + `<div class='mui-row'>` + `<div class='mui-col-md-10 mui-col-md-offset-1'>` +
    `<form class="mui-form">
    <legend>Edit Profile</legend><div class='mui-textfield mui-textfield--float-label'>
    <input type='text'>
    <label>Name</label>
    </div>
    <div class='mui-textfield mui-textfield--float-label'>
    <input type='text'>
    <label>Email</label>
    </div>
    <div class='mui-textfield mui-textfield--float-label'>
    <input type='text'>
    <label>Title</label>
    </div>
    <div class='mui-textfield mui-textfield--float-label'>
    <textarea></textarea>
    <label>Tell us about yourself</label>
    </div>
    <button class='mui-btn mui-btn--primary mui-btn--flat' id='btnPostCancel'>Cancel</button>
    <button type='submit' class='mui-btn mui-btn--primary mui-btn--raised'>Submit</button>
  </div></div></div></form>`;

    // show modal
    mui.overlay('on', modalEl);
  }
>>>>>>> 3ec4273d9c8c842e64d3f9f811b6291ca6723484
