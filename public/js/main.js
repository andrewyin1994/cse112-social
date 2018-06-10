import PostComponent from './PostComponent';
import PostService from './PostService';

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
$(window).load(function(){
    $('.loader').fadeOut(2000);
    
  });