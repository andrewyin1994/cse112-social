//homepage js

function cancelFunc() {
  mui.overlay('off');
}

// PostModal onclick event`

var postModal = document.getElementById('postModal');
var post = document.getElementById('post');
postModal.addEventListener('click', function () {
  var modalEl = document.createElement('div');
  modalEl.style.width = '800px';
  modalEl.style.height = '500px';
  modalEl.style.margin = '300px auto';
  modalEl.innerHTML = `<div class="mui-container-fluid" id="post">
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
          <textarea type="text" name="post" id="postText" onkeyup="SetButtonStatus(this, 'btnPost')"></textarea>
          </div>
        </form>
        <div>
        <img id="default" src="images/camera-icon.png" width="35" height="35">
        </div>
        <button class="mui-btn mui-btn--primary" id="btnPostCancel" onclick="mui.overlay('off')">CANCEL</button>
        <button class="mui-btn mui-btn--primary" disabled id="btnPost" style="float: right">POST</button>
      </div>
    </div>
  </div>`;

  // show modal
  mui.overlay('on', modalEl);
});

/*var PostCancel = document.getElementById('btnPostCancel');
PostCancel.onclick = function () {
    //mui.onclick("")
};*/

// end of homepage js signout

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

// PRELOADER
$(window).load(function () {
  let ref = document.referrer;
  console.log('ref', ref);
  $('.loader').fadeOut(2000);
});