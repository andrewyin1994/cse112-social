//homepage js


// Post Modal event listener
postModal.addEventListener('click', activatePosting);

// Activate post modal
function activatePosting() {
  var modalEl = document.createElement('div');
  modalEl.style.width = '800px';
  modalEl.style.height = '500px';
  modalEl.style.margin = '300px auto';
  modalEl.innerHTML = 
  `<div class="mui-container-fluid" id="post">
    <div class="mui-row">
      <div class="mui-col-md-6 mui-col-md-offset-3 mui-panel">
        <form class="mui-form">
          <table class="mui-table--bordered">
            <td>
              <img id="default" src="images/default-pic.png" width="35" height="35">
            </td>
            <td>
              <div>user name</div>
            </td>
          </table>
          <div class="mui-textfield mui-textfield--float-label">
          <textarea type="text" name="post" id="postText" onkeyup="setButtonStatus(this, 'postBtn')"></textarea>
          </div>
        </form>
        <div>
        <img id="default" src="images/camera-icon.png" width="35" height="35">
        </div>
        <button class="mui-btn mui-btn--primary" id="btnPostCancel" onclick="mui.overlay('off')">CANCEL</button>
        <button class="mui-btn mui-btn--primary" disabled id="postBtn" "style="float: right">POST</button>
      </div>
    </div>
  </div>`;

  // show modal
  mui.overlay('on', modalEl);

  document.getElementById('postBtn').addEventListener('click', () => {
    if(firebase.auth()) {
      let userRef = firestore.doc(`users/${firebase.auth().currentUser.uid}`);
      addPost(userRef);
    }
    mui.overlay('off', modalEl);
    showPostTest();
  });
}

/**
 *  From this line, it is for posting
 */

function setButtonStatus(sender, target) {
  if (sender.value.length == 0)
    document.getElementById(target).disabled = true;
  else
    document.getElementById(target).disabled = false;
}

<<<<<<< HEAD
function addPost(userRef, pt) {
  console.log('posting');
  const postText = document.getElementById('postText').value;
  let payload = new Post(userRef, postText);
  if (DEBUG) console.log(payload);
    firestore.collection('posts').add(payload.post);
}
var postBtn = document.getElementById('btnPost');
function postFunc(postBtn, pt) {
  postBtn.onclick = addPost(userRef, pt);
}

function cancelFunc() {
  mui.overlay('off');
}
=======
// function addPost(userRef, pt) {
//   console.log('posting');
//   const postText = document.getElementById('postText').value;
//   let payload = new Post(userRef, postText);
//   if (DEBUG) console.log(payload);
//     firestore.collection('posts').add(payload.post);
// }
// var postBtn = document.getElementById('postBtn');
// function postFunc(postBtn, pt) {
//   postBtn.onclick = addPost(userRef, pt);
// }

document.getElementById('btnLogout').addEventListener('click', function () {
  const currentUser = firebase.auth().currentUser;
  firebase.auth().signOut().then(function () {
    // Sign-out successful.
    console.log(currentUser + "signed out");

    window.location.href = "index.html";
  }, function (error) {
    // An error happened.
  });
});
>>>>>>> d2da74da3a8bfa5dff49bc25baea704a06ede36d

// PRELOADER
$(window).load(function () {
  let ref = document.referrer;
  console.log('ref', ref);
  $('.loader').fadeOut(2000);
});
