const editProfile = document.getElementById('editProfile');

editProfile.addEventListener('click', editProfileForm);

function getUserName(){
    firestore.collection('users').doc(firebase.auth().currentUser.uid).get().then(function(snapshot){
        console.log(snapshot.data().name);
    });
}

function closeMui() {
  mui.overlay('off');
}

function submitEdit() {
  
}

function editProfileForm() {
  // initialize modal element
  var modalEl = document.createElement('div');
  modalEl.style.width = '40em';
  modalEl.style.height = '40em';
  modalEl.style.margin = '10em auto';
  modalEl.style.backgroundColor = '#fff';

  modalEl.innerHTML = 
  `<div class='mui-container-fluid' style='padding-top: 3em;'> 
    <div class='mui-row'> 
      <div class='mui-col-md-10 mui-col-md-offset-1'>
        <form class="mui-form">
          <legend>Edit Profile</legend>
          <div class='mui-textfield mui-textfield--float-label'>
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
        </form>
        <button class='mui-btn mui-btn--primary mui-btn--flat' id='btnPostCancel'>Cancel</button>
        <button type='submit' class='mui-btn mui-btn--primary mui-btn--raised' id='submitBtn'>Submit</button>
      </div>
    </div>
  </div>`;

  // show modal
  mui.overlay('on', modalEl);

  document.getElementById('btnPostCancel').addEventListener('click', closeMui);
  document.getElementById('submitBtn').addEventListener('click', submitEdit);
}

firebase.auth().onAuthStateChanged(firebaseUser => {
  let userRef;
  //display profile information
  if(firebaseUser) {
    userRef = firestore.doc(`users/${firebaseUser.uid}`);
    userRef.get().then(user => {
      console.log('user', user.data());
      document.getElementById('profileName').innerHTML = user.data().name;
      document.getElementById('profileTitle').innerHTML = user.data().title;
    });
  }
});