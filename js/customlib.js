/**
 * Custom library to add custom functionality to activities in this learning object.
 *
 * @author: David Herney
 */
(function (app) {
  function onAppLoaded() {
    const mainTrack = new Audio("content/sounds/main_track.mp3");
    mainTrack.load();
    /**
     * To handle when an activity has been completed.
     * @param {event} event
     * @param {JQuery object} $el
     * @param {object} args
     */
    function onActivityCompleted(event, $el, args) {
      if (/idact/.test(args.id) && args.weight > 99) {
        $($el.attr("data-relation")).show();
        return;
      }
    }

    function playPauseMainTrack() {
      if (!mainTrack.paused) {
        mainTrack.pause();
        $('[data-global="play-pause"] > *')
          .addClass("pause")
          .removeClass("play");
        $('[data-global="play-pause"] > * > *').text("Reproducir pista");
      } else {
        $('[data-global="play-pause"] > *')
          .addClass("play")
          .removeClass("pause");
        $('[data-global="play-pause"] > * > *').text("Pausar pista");
        mainTrack.play();
      }
    }

    function changeFontSize(increase) {
      var maxVal = 24;
      var minVal = 16;
      var currentSize = parseInt($(':root').css('font-size'));
      if ((currentSize === maxVal && increase) || (currentSize === minVal && !increase)) {
        return;
      }
      var amount = increase ? 2 : -2;
      $(':root').css('font-size', currentSize + amount);
    }

    function pageChanged(i, v) {
      console.log("Hola mundo")
    }

    //Menu control.
    var $menu_modal = $("#menu_page").dialog({
      modal: true,
      autoOpen: false,
      width: 500,
      height: 300,
      classes: {
        "ui-dialog": "menu_page_dialog",
      },
      close: function () {
        $("body").removeClass("dhbgapp_fullview");
      },
    });

    $('[data-global="menu"]').on('click', function () {
      var $dialog = $('#menu_page');
      $menu_modal.dialog('open');
    })

    // Register application event handlers.
    $(app).on("jpit:activity:completed", onActivityCompleted);
    // $(window).one("click", playPauseMainTrack);
    $('[data-global="play-pause"]').click(playPauseMainTrack);

    $('[data-change-font]').on('click', function () {
      var increase = $(this).attr('data-change-font') === 'increase';
      changeFontSize(increase);
    });

    $(app).on('afterPageChange', console.log("Cambié de pagina"));

    $.each(app.actions.afterChangePage, function(i, v){
      console.log("Hola mundo")
    });
  }

  

  $(window).on("load", onAppLoaded);
})(dhbgApp);
