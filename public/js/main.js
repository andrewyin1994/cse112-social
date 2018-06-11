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

    $('#post-container').append(PostComponent({content:'first'}))
    $('#post-container').append(PostComponent({content:'second'}))
    $('#post-container').append(PostComponent({content:'third'}))

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

// PostModal onclick event

var postModal = document.getElementById('postModal');
var post = document.getElementById('post');
postModal.addEventListener('click',function(){
    var modalEl = document.createElement('div');
    modalEl.style.width = '800px';
    modalEl.style.height = '500px';
    modalEl.style.margin = '300px auto';
    modalEl.appendChild(post);

    // show modal
    mui.overlay('on', modalEl);
});
var PostCancel = document.getElementById('btnPostCancel');
PostCancel.onclick = function(){
    mui.onclick("")
};


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