const editProfile = document.getElementById('editProfile');
const editDescription = document.getElementById('editDescription');
const profileName = document.getElementById('profileName');
const profileTitle = document.getElementById('profileTitle');
const profileDesc = document.getElementById('profileDesc')

// This is for set UserName onAuth
function setUserName(newName){
    firebase.auth().currentUser.updateProfile({
       displayName: newName
    }).then(function() {
        // Update successful.
        firebase.auth().currentUser.name = newName;
        console.log('ssuccessfully changed');
    }).catch(function(error) {
        // An error happened.
        console.log('could not changed');
    });
}

// This is for get Username onAuth
function getUserName(){
    if(firebase.auth().currentUser.name != null){
        return firebase.auth().currentUser.name;
    }else{
        console.log('Need to put name');
    }
}

// This is for getting email
function getUserEmail(){
    return firebase.auth().currentUser.email;
}

// This is for getting uid
function getUserUid(){
    return firebase.auth().currentUser.uid;
}

// This is for setting name and title on firebase
function setUserNameAndTitle(newName, newTitle){
    let uid = getUserUid();
    let userInfo = firestore.collection('users').doc(uid);
    userInfo.update({
        name : `${(newName != null && newName != "" ? newName: name)}`,
        title: `${(newTitle != null && newTitle != "" ? newTitle: title)}`    
    }).then(() => {
      profileName.innerHTML = newName;
      profileTitle.innerHTML = newTitle;
    });
}

// This is for setting description on firebase
function setUserDescription(newDescription) {
    let uid = getUserUid();
    let userInfo = firestore.collection('users').doc(uid);
    userInfo.update({
        description: `${(newDescription != null && newDescription != "" ? newDescription: description)}`
    }).then(() => {
      profileDesc.innerHTML = newDescription;
    });
}

// EventListeners
editProfile.addEventListener('click', editProfileForm);
editDescription.addEventListener('click', editDescriptionForm);

function closeMui() {
  mui.overlay('off');
}

function editProfileForm() {
    // initialize modal element
    var modalEl = document.createElement('div');
    modalEl.style.width = '40em';
    modalEl.style.height = '30em';
    modalEl.style.margin = '10em auto';
    modalEl.style.backgroundColor = '#fff';
  
    modalEl.innerHTML = 
    `<div class='mui-container-fluid' style='padding-top: 3em;'> 
      <div class='mui-row'> 
        <div class='mui-col-md-10 mui-col-md-offset-1'>
          <form class="mui-form">
            <legend>Edit Profile</legend>
            <div class='mui-textfield mui-textfield--float-label'>
              <input type='text' id='name'>
              <label>Name</label>
            </div>
            <div class='mui-textfield mui-textfield--float-label'>
              <input type='text' id='title'>
              <label>Title</label>
            </div>
            <p>Change profile picture: <input type="file" name="myFile"></p>
          </form>
          <button class='mui-btn mui-btn--primary mui-btn--flat' id='btnPostCancel'>Cancel</button>
          <button type='submit' class='mui-btn mui-btn--primary mui-btn--raised' id='submitBtn'>Submit</button>
        </div>
      </div>
    </div>
  </div>`;

  // show modal
  mui.overlay('on', modalEl);

    document.getElementById('btnPostCancel').addEventListener('click', closeMui);
    document.getElementById('submitBtn').addEventListener('click', function() {
        // Set Name on Firebase.auth()
        // setUserName(document.getElementById('name').value);
        // Set Name and title on Firebase Field
        setUserNameAndTitle(document.getElementById('name').value, document.getElementById('title').value);
        mui.overlay('off', editDescription);
    });
}

function editDescriptionForm() {
  // initialize modal element
  var modalEl = document.createElement('div');
  modalEl.style.width = '40em';
  modalEl.style.height = '20em';
  modalEl.style.margin = '10em auto';
  modalEl.style.backgroundColor = '#fff';

  modalEl.innerHTML = 
  `<div class='mui-container-fluid' style='padding-top: 3em;'> 
    <div class='mui-row'> 
      <div class='mui-col-md-10 mui-col-md-offset-1'>
        <form class="mui-form">
          <legend>Edit Description</legend>
          <div class='mui-textfield mui-textfield--float-label'>
          <textarea id = 'description'></textarea>
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
  document.getElementById('submitBtn').addEventListener('click', function() {
    setUserDescription(document.getElementById('description').value);
    mui.overlay('off', editProfile);
  });
}

firebase.auth().onAuthStateChanged(firebaseUser => {
  let userRef;
  //display profile information
  if(firebaseUser) {
    userRef = firestore.doc(`users/${firebaseUser.uid}`);
    userRef.get().then(user => {
      console.log('user', user.data());
      profileName.innerHTML = user.data().name;
      profileTitle.innerHTML = user.data().title;
      profileDesc.innerHTML = user.data().description;
    });
  }
});