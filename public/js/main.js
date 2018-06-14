// import PostComponent from '../js/PostComponent.js';
const DEBUG = true;

//Getting IDs from homepage.html
const postModal = document.getElementById('postModal')
const post = document.getElementById('post');

/**
 * Post class, what will be added to Firestore
 * @param {*} userRef ref to current logged in user
 * @param {*} postText text that user wishes to post
 */
class Post {
  constructor(userRef, postText) {
    this.post = {
      ownRef: userRef,
      ownerId: userRef.id,
      postText: postText,
      createDate: new Date().getTime(),
      favorRefs: [],
      imageUrl: []
    }
  }
}

// homepage js
jQuery(function ($) {
  var $bodyEl = $('body'),
    $sidedrawerEl = $('#sidedrawer');

  function showSidedrawer() {
    // show overlay
    var options = {
      onclose: function () {
        $sidedrawerEl
          .removeClass('active')
          .appendTo(document.body);
      }
    };

    var $overlayEl = $(mui.overlay('on', options));

    // show element
    $sidedrawerEl.appendTo($overlayEl);
    setTimeout(function () {
      $sidedrawerEl.addClass('active');
    }, 20);
  }

  function abc(prop) {
    return `<div class="mui-row">
    <div class="mui-col-md-6 mui-col-md-offset-3 mui-panel">
    <p>${prop.content}</p>
    </div>
  </div>`;
  }

  $('#post-container').append(abc({ content: 'first' }))

  function hideSidedrawer() {
    $bodyEl.toggleClass('hide-sidedrawer');
  }

  $('.js-show-sidedrawer').on('click', showSidedrawer);
  $('.js-hide-sidedrawer').on('click', hideSidedrawer);

  var $titleEls = $('strong', $sidedrawerEl);

  $titleEls
    .next()
    .hide();

  $titleEls.on('click', function () {
    $(this)
      .next()
      .slideToggle(200);
  });
});

function cancelFunc() {
  mui.overlay('off');
}

// Post Modal event listener
postModal.addEventListener('click', activatePosting);

// Activate post modal
function activatePosting(){
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
          <textarea type="text" name="post" id="postText" onkeyup="setButtonStatus(this, 'btnPost')"></textarea>
          </div>
        </form>
        <div>
        <img id="default" src="images/camera-icon.png" width="35" height="35">
        </div>
        <button class="mui-btn mui-btn--primary" id="btnPostCancel" onclick="mui.overlay('off')">CANCEL</button>
        <button class="mui-btn mui-btn--primary" disabled id="btnPost" onclick = "postFunc(postBtn, postText)"style="float: right">POST</button>
      </div>
    </div>
  </div>`;

  // show modal
  mui.overlay('on', modalEl);
}

function setButtonStatus(sender, target) {
  if (sender.value.length == 0)
    document.getElementById(target).disabled = true;
  else
    document.getElementById(target).disabled = false;
}

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
  $('.loader').fadeOut(2000);
});