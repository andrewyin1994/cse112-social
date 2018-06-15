const editProfile = document.getElementById('editProfile');

// This is for set UserName
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

// This is for get UserName
function getUserName(){
    if(firebase.auth().currentUser.name != null){
        return firebase.auth().currentUser.name;
    }else{
        console.log('Need to put name');
    }
}

// This is for get email
function getUserEmail(){
    return firebase.auth().currentUser.email;
}

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
