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

    //Menu control.
    var $menu_modal = $("#menu_page").dialog({
      moda: true,
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
    $(window).one("click", playPauseMainTrack);
    $('[data-global="play-pause"]').click(playPauseMainTrack);
  }

  $(window).on("load", onAppLoaded);
})(dhbgApp);
