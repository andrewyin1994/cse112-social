import PostComponent from '../js/PostComponent.js';

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

  $('#post-container').append(PostComponent({ content: 'first' }))
  $('#post-container').append(PostComponent({ content: 'second' }))
  $('#post-container').append(PostComponent({ content: 'third' }))

  function hideSidedrawer() {
    $bodgityEl.toggleClass('hide-sidedrawer');
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
            <input type="text" name="text" id="postContent">
            <label for="user">What's new with you?</label>
          </div>
        </form>

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

document
  .getElementById('btnLogout')
  .addEventListener('click', function () {
    const currentUser = firebase
      .auth()
      .currentUser;
    firebase
      .auth()
      .signOut()
      .then(function () {
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