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


  // $('#post-container').append(PostComponent({ content: 'first' }))
  // $('#post-container').append(PostComponent({ content: 'second' }))
  // $('#post-container').append(PostComponent({ content: 'third' }))
  // function abc(prop){
  //   return `<div class="mui-row">
  //   <div class="mui-col-md-6 mui-col-md-offset-3 mui-panel">
  //   <p>${prop.content}</p>
  //   </div>
  // </div>`;
  // }
  
  // $('#post-container').append(abc({ content: 'first' }))

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
