// This file is part of CDI Tool
//
// CDI is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// CDI is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with CDI.  If not, see <http://www.gnu.org/licenses/>.

'use strict';

dhbgApp.standard = {};

dhbgApp.standard.start = function() {
    dhbgApp.transition = 'fade';
    dhbgApp.transitionDuration = 400;
    dhbgApp.transitionOptions = {};

    $('main > section').hide();
    $('main').show();
    $('body').removeClass('loading');

    if (dhbgApp.scorm) {
        dhbgApp.scorm.initialization({activities_percentage: dhbgApp.evaluation.activities_percentage});
    }

    // ==============================================================================================
    // Build menus.
    // ==============================================================================================
    $('nav > menu').each(function(){
        var $this = $(this);
        var $nav = $this.parent();

        var $more_class = $this.attr('type') ? $this.attr('type') : 'horizontal';
        var $menu = $('<ul class="menu ' + $more_class + '" role="menu"></ul>');

        var f_builditem;

        var f_buildsubmenu = function($sub) {
            var $submenu = $('<ul class="submenu" role="menu"></ul>');
            $sub.find('> menuitem').each(function(){
                var $item = f_builditem($(this));
                $submenu.append($item);
            });

            $submenu.find('> li').first().addClass('first-child');
            $submenu.find('> li:last-child').first().addClass('last-child');
            return $submenu;
        };

        f_builditem = function($li) {
            var $item = $('<li role="button" class="button"></li>');

            if ($li.attr('label')) {
                $item.html($li.attr('label'));
            }
            else {
                var $children = $li.children();
                if ($children.length > 0) {
                    $item.append($children);
                }
                else {
                    $item.html($li.html());
                }
            }

            var $withsub = false;
            $li.find('> menu').each(function(){
                $item.append(f_buildsubmenu($(this)));
                $withsub = true;
            });

            if ($withsub) {
                $item.addClass('withsubitems');
                $item.on('click', function(e){
                  if(e.target.classList.contains('withsubitems')) {
                    $item.toggleClass('open');
                  }
                })
            } 

            if ($li.attr('data-page')) {
                $item.attr('data-page', $li.attr('data-page'));
            }

            if ($li.attr('data-global-id')) {
                $item.attr('data-global', $li.attr('data-global-id'));
            }

            if ($li.attr('title')) {
                $item.attr('title', $li.attr('title'));
            }

            return $item;
        };

        $this.find('> menuitem').each(function(){
            var $item = f_builditem($(this));
            $menu.append($item);
        });

        $menu.find('> li').first().addClass('first-child');
        $menu.find('> li:last-child').first().addClass('last-child');

        $nav.empty();
        $nav.append($menu);


    });

    // ==============================================================================================
    // Progress control
    // ==============================================================================================
    $('.measuring-progress').each(function() {
        if (typeof dhbgApp.scorm == 'object') {
            var $this = $(this);
            var type = $this.attr('data-type') ? $this.attr('data-type') : 'default';
            $this.addClass(type);
            var progress_text = dhbgApp.s('progress');

            switch (type) {
                case 'horizontal':
                    var $box_label = $('<div class="results_value"><span><label>0</label>%</span></div>');
                    var $label = $box_label.find('label');
                    var $box_bar = $('<div class="results_level"><div></div></div>');
                    var $bar = $box_bar.find('div');
                    $this.append($box_label);
                    $this.append($box_bar);
                    $box_label.append('<div class="progress_text">' + progress_text + '</div>')
                    dhbgApp.loadProgress = function(progress) {
                        $bar.css('width', progress + '%');
                        $label.text(progress);
                    };
                    break;
                case 'vertical':
                    var $box_label = $('<div class="results_value"><label>0</label><br />%</div>');
                    var $label = $box_label.find('label');
                    var $box_bar = $('<div class="results_level"><div></div></div>');
                    var $bar = $box_bar.find('div');
                    $this.append($box_label);
                    $this.append($box_bar);
                    $this.append('<div class="progress_text">' + progress_text + '</div>')
                    dhbgApp.loadProgress = function(progress) {
                        $bar.css('height', (100 - progress) + '%');
                        $label.text(progress);
                    };
                    break;
                case 'circle':
                    $this.addClass('c100 small');
                    var $label = $('<span></span>');
                    var $bar = $('<div class="slice"><div class="bar"></div><div class="fill"></div></div>');
                    $this.append($label);
                    $this.append($bar);
                    dhbgApp.loadProgress = function(progress) {
                        $this.addClass('p' + progress);
                        $label.text(progress + '%');
                    };
                    break;
                default:
                    var $label = $('<label></label)');
                    var $bar = $('<progress value="0" max="100"></progress>');
                    $this.append('<div class="progress_text">' + progress_text + '</div>')
                    $this.append($bar);
                    $this.append($label);
                    dhbgApp.loadProgress = function(progress) {
                        $label.html(progress + '%');
                        $bar.attr('value', progress);
                    };
            }
        }
    });

    // TODO: leono286, this should be handled with CSS not JS.
    // ==============================================================================================
    // Actions on buttons
    // ==============================================================================================
    $('.button').on('mouseover', dhbgApp.defaultValues.buttonover);

    $('.button').on('mouseout', dhbgApp.defaultValues.buttonout);

    // ==============================================================================================
    // Images preload.
    // ==============================================================================================
    var imgs = [];
    $('img').each(function() {
        var img_src = $(this).attr('src');
        if (!imgs[img_src]) {
            var img = new Image();

            img.onload = function(){
                // Image has been loaded.
            };

            img.src = img_src;

            imgs[img_src] = true;
        }
    });

    // ==============================================================================================
    // Handlers of the Menu/Drawer
    // ==============================================================================================
    $('#drawer-toggle').on('change', function() {
      $('body').toggleClass('panel-open', this.checked);
    });

    function getBreakpoint(viewportWidth) {
      if (viewportWidth >= 1024) {
          return 'large';
      } else if (viewportWidth >= 768) {
          return 'small-large';
      } else if (viewportWidth >= 600) {
          return 'medium';
      } else if (viewportWidth <= 600 && viewportWidth >= 320) {
          return 'up-to-medium';
      } else {
          return 'small';
      }
    }

    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (getBreakpoint(viewportWidth) === 'large') {
        $('#drawer-toggle').prop('checked', true);
        $('body').addClass('panel-open')
    }

    $('.scorm__drawer').on('click', function(e) {
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if(e.target.tagName.toLowerCase() === 'li' && getBreakpoint(viewportWidth)!=='large' && !e.target.classList.contains('withsubitems')) {
        $('#drawer-toggle').click();
      }
    });
    $('.drawer__overlay').on('click', function() {
      $('#drawer-toggle').click();
    })
  

    // ==============================================================================================
    // Buttons to load page
    // ==============================================================================================
    dhbgApp.DB.dataPage = null;

    $('[data-page]').on('click', function () {
        var $this = $(this);
        dhbgApp.loadPageN($this.attr('data-page'));

        if ($this.attr('data-section')) {
            dhbgApp.DB.dataPage = $this.attr('data-section');
        }
    });

    dhbgApp.actions.afterChangePage[dhbgApp.actions.afterChangePage.length] = function($current_subpage) {
        if (dhbgApp.DB.dataPage) {
            $("html, body").animate({ scrollTop: $(dhbgApp.DB.dataPage).offset().top }, 500);
            dhbgApp.DB.dataPage = null;
        }
    };

    $('main > section').each(function() {
      var $page = $(this);
      $page.append(`
      <div class="scorm__controls">
        <button class="button scorm__button scorm__control scorm__control--prev" previous-page>
          <svg viewBox="0 0 24 24">
            <use
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xlink:href="content/icons.svg#chevron-left"></use>
          </svg>
          Página anterior
        </button>
        <button class="button scorm__button scorm__control scorm__control--next" next-page>
          Siguiente página
          <svg viewBox="0 0 24 24">
            <use
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xlink:href="content/icons.svg#chevron-right"></use>
          </svg>
        </button>
      </div>
      `);
  });

    $('[next-page]').on('click', function () {
        if ($(this).hasClass('disabled')) {
            return;
        }

        var next = dhbgApp.DB.currentSubPage + 1;

        if (!dhbgApp.FULL_PAGES && dhbgApp.pages[dhbgApp.DB.currentPage].subpages > next) {
            dhbgApp.loadSubPage(dhbgApp.DB.currentPage, next);
        }
        else {
            dhbgApp.loadPage(dhbgApp.DB.currentPage + 1);
        }
    });

    $('[previous-page]').on('click', function () {
        if ($(this).hasClass('disabled')) {
            return;
        }

        var next = dhbgApp.DB.currentSubPage - 1;

        if (!dhbgApp.FULL_PAGES && next >= 0) {
            dhbgApp.loadSubPage(dhbgApp.DB.currentPage, next);
        }
        else if (dhbgApp.DB.currentPage > 0){
            dhbgApp.loadPage(dhbgApp.DB.currentPage - 1, dhbgApp.pages[dhbgApp.DB.currentPage - 1].subpages - 1);
        }
    });

    // ==============================================================================================
    // Special box text
    // ==============================================================================================
    $('.box-text').each(function(){
        var $this = $(this);
        var $children = $this.children();
        var $box_ribbon = $(`<div class="box-text__ribbon">
          <svg viewBox="0 0 24 24">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="content/icons.svg#ribbon"></use>
          </svg>
        </div>
        `);
        var $box_body = $('<div class="box_body"></div>');

        var $object = ($children.length > 0) ? $children : $this.html();

        $box_body.append($object);


        $this.empty();

        if ($this.attr('label')) {
            var $box_header = $('<div class="box-text__header"></div>');
            var $box_header_icon = $(`<div class="box-text__header-icon"></div>`)
            var $box_title = $('<div class="title">' + $this.attr('label') + '</div>');
            $box_header.append($box_header_icon);
            $box_header.append($box_title);
            $this.append($box_header);
        }

        $this.append($box_body);
        $this.append($box_ribbon);
    });

    // ==============================================================================================
    // Cards
    // ==============================================================================================
    $('.card').each(function(){
      const $this = $(this);
      const $children = $this.children();
      const $card_body = $('<div class="card__body"></div>');
      const $object = ($children.length > 0) ? $children : $this.html();
      $card_body.append($object);

      if($this.attr('label')) {
        var $card_title = $(`<div class="card__title">${$this.attr('label')}</div>`);
        $card_body.prepend($card_title);
      }

      if($this.attr('img') && $this.attr('img-alt') ) {
        var $card_img = $(`<div class="card__img"><img src="${$this.attr('img')}" alt="${$this.attr('img-alt')}"></div>`);
        $this.append($card_img);
      }

      $this.append($card_body);
    })

    // ==============================================================================================
    // Modal Windows
    // ==============================================================================================
    $('.w-content').each(function() {
        var $this = $(this);
        var properties = {
            modal: true,
            autoOpen: false,
            close: function( event, ui ) {
                $('body').removeClass('dhbgapp_fullview');
                const $iframeInContent = $(this).find('iframe');
                if($iframeInContent.length) {
                    $iframeInContent.each(function(){
                        this.contentWindow
                            .postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
                    })
                }
            }, 
            open: function(event, ui) { 
                $('.ui-widget-overlay').bind('click', function() { 
                    $(this).siblings('.ui-dialog').find('.ui-dialog-content').dialog('close'); 
                }); 
            }
        };

        if ($this.attr('data-property-width')) {
            properties.width = $this.attr('data-property-width');

            if (properties.width.indexOf('%') >= 0) {
                var window_w = $(window).width();
                var tmp_w = Number(properties.width.replace('%', ''));
                if (!isNaN(tmp_w) && tmp_w > 0) {
                    properties.width = tmp_w * window_w / 100;
                }
            }
        }

        if ($this.attr('data-property-height')) {
            properties.height = $this.attr('data-property-height');

            if (properties.height.indexOf('%') >= 0) {
                var window_h = $(window).height();
                var tmp_h = Number(properties.height.replace('%', ''));
                if (!isNaN(tmp_h) && tmp_h > 0) {
                    properties.height = tmp_h * window_h / 100;
                }
            }
        }

        if ($this.attr('data-cssclass')) {
            properties.dialogClass = $this.attr('data-cssclass');
        }

        $this.dialog(properties);
    });

    $(document).on('click', '.w-content-controler', function(){
        var $this = $(this);
        var $dialog = $($this.attr('data-content'));
        var w = $this.attr('data-property-width');
        var h = $this.attr('data-property-height');

        if (w) {
            if (w.indexOf('%') >= 0) {
                var window_w = $(window).width();
                var tmp_w = Number(w.replace('%', ''));
                if (!isNaN(tmp_w) && tmp_w > 0) {
                    w = tmp_w * window_w / 100;
                }
            }

            $dialog.dialog('option', 'width', w);
        }

        if (h) {
            if (h.indexOf('%') >= 0) {
                var window_h = $(window).height();
                var tmp_h = Number(h.replace('%', ''));
                if (!isNaN(tmp_h) && tmp_h > 0) {
                    h = tmp_h * window_h / 100;
                }
            }

            $dialog.dialog('option', 'height', h);
        }

        $dialog.dialog('open');
        $('body').addClass('dhbgapp_fullview');
    });

    // ==============================================================================================
    // Global Controls
    // ==============================================================================================

    // Return and "close all" control.
    if (window.parent.document != window.document) {
        var $scorm_frame = $('body', window.parent.document);
        $('[data-global="return"]').on('click', function () {
            var $this = $(this);
            if ($this.hasClass('minimized')) {
                $scorm_frame.addClass('scorm_full_page');
                $this.removeClass('minimized');
            }
            else {
                $scorm_frame.removeClass('scorm_full_page');
                $this.addClass('minimized');
            }
        });

        $('[data-global="close_all"]').on('click', function () {
            if (dhbgApp.scorm) {
                dhbgApp.scorm.close(function() {
                    window.parent.document.location.href = dhbgApp.scorm.getReturnUrl();
                });
            }
        });
    }
    else {
        $('[data-global="return"]').hide();
        $('[data-global="close_all"]').hide();
    }

    // Results control.
    var $results_modal = $('#results_page').dialog({
        modal: true,
        autoOpen: false,
        classes: {
            "ui-dialog": "results_page_dialog"
        },
        close: function() {
            $('body').removeClass('dhbgapp_fullview');
        }
    });

    $('[data-global="results"], .measuring-progress').on('click', function () {

        var $dialog = $('#results_page');
        var $visited = $dialog.find('#results_page_visited');
        $visited.empty();

        var index, $current_page;
        var position = 1;
        for(index in dhbgApp.scorm.scoList) {
            if (dhbgApp.scorm.scoList[index]) {
                var sco = dhbgApp.scorm.scoList[index];
                $current_page = $(`
                  <button class="result_sco general">
                    <div class="result_sco__eyebrow">
                      <span class="result_sco__page">Página ${position}</span>
                      ${sco.visited ? '<span class="result_sco__visit result_sco__visit--visited">Visto</span>': '<span class="result_sco__visit result_sco__visit--no-visited">No visto</span>'}
                    </div>
                    <div class="result_sco__title">${dhbgApp.pages[index].title}</div>
                  </button>
                `);
                if (sco.visited) {
                    $current_page.addClass('visited');
                }

                $current_page.addClass('button');
                $current_page.on('mouseover', dhbgApp.defaultValues.buttonover);
                $current_page.on('mouseout', dhbgApp.defaultValues.buttonout);

                $current_page.data('index-page', sco.page);
                $current_page.on('click', function() {

                    $results_modal.dialog( "close" );
                    dhbgApp.loadPage($(this).data('index-page'));
                });

                $visited.append($current_page);
                position++;
            }
        }

        var $activities = $dialog.find('#results_page_activities');
        var $ulactivities = $('<ul class="data_list"></ul>')
        $activities.empty();
        $activities.append($ulactivities);

        for (var activity_key in dhbgApp.scorm.activities) {
            if (dhbgApp.scorm.activities[activity_key]) {

                var $data_act = $('[data-act-id="' + activity_key + '"]');
                var title = $data_act.attr('data-act-title') ? $data_act.attr('data-act-title') : activity_key;
                var $act = $('<li class="result_activity"></li>');

                var $parent_page = $data_act.parents('.page');

                if ($parent_page.length > 0) {
                    var title = $('<a href="javascript:;"><strong>' + title + ': </strong></a>');

                    title.data('index-page', $parent_page.data('index-page'));

                    title.on('click', function() {

                        $results_modal.dialog( "close" );
                        dhbgApp.loadPage($(this).data('index-page'));
                    });
                }
                else {
                    title = '<span class="result_activity__title">' + title + ': </span>';
                }

                $act.append(title);


                if (typeof dhbgApp.scorm.activities[activity_key] == 'string') {
                    $act.append(dhbgApp.scorm.activities[activity_key] + '%');
                }
                else if (typeof dhbgApp.scorm.activities[activity_key] == 'object' && dhbgApp.scorm.activities[activity_key].length > 0) {
                    var list_intents = [];
                    for(var intent = 0; intent < dhbgApp.scorm.activities[activity_key].length; intent++) {
                        if (dhbgApp.scorm.activities[activity_key][intent]) {
                            list_intents[list_intents.length] = dhbgApp.scorm.activities[activity_key][intent] + '%';
                        }
                        else {
                            list_intents[list_intents.length] = '0%';
                        }
                    }
                    if(list_intents.includes('100%')){
                      $act.addClass('done');
                    }
                    $act.append(`<span class="result_activity__intents">${list_intents.join(', ')}</span>`);
                }
                else {
                    $act.append(`<span class="result_activity__intents">${dhbgApp.s('activities_attempts')}</span>`);
                }
                $ulactivities.append($act);
            }
        }

        $('body').addClass('dhbgapp_fullview');
        $results_modal.dialog('open');
    });

    var w_global_modal = dhbgApp.documentWidth > 900 ? 900 : dhbgApp.documentWidth - 50;

    // Credits control.
    var $credits_modal = $('#credits-page').dialog({
        modal: true,
        autoOpen: false,
        classes: {
            "ui-dialog": "results_page_dialog"
        },
        close: function() {
            $('body').removeClass('dhbgapp_fullview');
        }
    });

    $('[data-global="credits"]').on('click', function () {

        $('body').addClass('dhbgapp_fullview');
        $credits_modal.dialog('open');
    });

    // Library control.
    var $library_modal = $('#library-page').dialog({
        modal: true,
        autoOpen: false,
        width: w_global_modal,
        height: dhbgApp.documentHeight - 50,
        classes: {
            "ui-dialog": "library_page_dialog"
        },
        close: function() {
            $('body').removeClass('dhbgapp_fullview');
        }
    });

    $('[data-global="library"]').on('click', function () {

        $('body').addClass('dhbgapp_fullview');
        $library_modal.dialog('open');
    });

    // ==============================================================================================
    // Special control: View first
    // ==============================================================================================
    $('.view-first').each(function () {
        var $this = $(this);

        var $mask = $('<div class="mask"></div>');
        $mask.append($this.find('.view-content'));

        $this.append($mask);
    });

    // ==============================================================================================
    // Horizontal menu
    // ==============================================================================================
    $('.horizontal-menu').each(function(){

        var $this = $(this);
        var $chalkboard_items = $('<div class="horizontal-menu__chalkboard-items"></div>');
        var $chalkboard_content = $('<div class="horizontal-menu__chalkboard-content"></div>');

        $this.find('>dl').each(function() {
            var $dl = $(this);

            var $dd= $('<div class="horizontal-menu__item-content"></div>');
            $dd.append($dl.find('>dd').children());
            var $dt = $('<button class="horizontal-menu__item-button">' + $dl.find('>dt').html() + '</button>').on('click', function(){

                var $item_dt = $(this);

                if (dhbgApp.DB.loadSound) {
                    dhbgApp.DB.loadSound.pause();
                    $chalkboard_content.find('audio').each(function(){
                        this.pause();
                    });
                }

                $chalkboard_items.find('.current').removeClass('current');
                $chalkboard_content.find('.current').removeClass('current');
                $item_dt.addClass('current');
                $dd.addClass('current');
            });

            $chalkboard_items.append($dt);

            $chalkboard_content.append($dd);
        });

        $chalkboard_items.find(':first-child').addClass('current');
        $chalkboard_content.find(':first-child').addClass('current');
        $this.empty();

        $this.append($chalkboard_items);
        $this.append('<div class="clear"></div>');
        $this.append($chalkboard_content);
        $this.append('<div class="clear"></div>');

    });

    // ==============================================================================================
    // Pagination
    // ==============================================================================================
    $('.ctrl-pagination').each(function() {
        var $this = $(this);
        var $items = $this.find('>li');
        var $list = $('<ul class="layers"></ul>');
        var total_pages = $items.length;

        if ($this.attr('data-layer-height')) {
            $list.height($this.attr('data-layer-height'));
        }

        var data_labelcurrent   = ($this.attr('data-labelcurrent') && $this.attr('data-labelcurrent') == 'true');
        var orientation         = 'horizontal';

        $this.addClass(orientation);

        //var buttons = [];
        var $list_buttons = $('<ul class="pagination ' + 'arrows' + '"></ul>');

        var i = 1;

        $items.each(function(){
            var $item = $(this);
            $item.addClass('layer');
            $list.append($item);

            var label = i;

            if (data_labelcurrent) {
                $item.append('<div class="label_current">' + label + '</div>');
            }


            i++;
        });
        $items.data('current', 0);

            // Next button.
            var $next_button = $('<li><button class="button next"></button></li>');

            // Back button.
            var $back_button = $('<li><button class="button previous"></button></li>');

            // It in first page is hidden.
            $back_button.css('visibility', 'hidden');

            var $position_index_label;

            // Back button event.
            $back_button.on('click', function() {

                if (dhbgApp.DB.loadSound) {
                    dhbgApp.DB.loadSound.pause();
                    dhbgApp.DB.loadSound.currentTime = 0;
                }
                var new_item_index = $items.data('current') - 1;

                if (new_item_index < 0) {
                    return;
                }

                var prevpage = $items.get(new_item_index);
                $items.data('current', new_item_index);
                $list.css({ "--current-page": `${new_item_index}` });
                $position_index_label.text(dhbgApp.s('pagination_label', { 'a': (new_item_index + 1), 'b': $items.length } ));

                if (new_item_index < $items.length) {
                    $next_button.css('visibility', 'visible');
                }

                if (new_item_index == 0) {
                    $back_button.css('visibility', 'hidden');
                }
                $this.trigger('jpit:pagination:changed', prevpage);
            });

            $list_buttons.append($back_button);
            // End Back button.

            if (orientation == 'vertical' || orientation == 'sides') {
                $position_index_label = $('<div class="position">' + dhbgApp.s('pagination_label', { 'a': 1, 'b': $items.length } )  + '</div>');
                $this.append($position_index_label);
            }
            else {
                $position_index_label = $('<li class="position">' + dhbgApp.s('pagination_label', { 'a': 1, 'b': $items.length } )  + '</li>');
                $list_buttons.append($position_index_label);
            }

            // Next button event.
            $next_button.on('click', function() {
                var $self = $(this);
                if ($self.has('.button.next[disabled]').length > 0) {
                    return;
                }

                if (dhbgApp.DB.loadSound) {
                    dhbgApp.DB.loadSound.pause();
                    dhbgApp.DB.loadSound.currentTime = 0;
                }

                var new_item_index = $items.data('current') + 1;
                if (new_item_index >= $items.length) {
                    return;
                }

                var nextpage = $items.get(new_item_index);
                $items.data('current', new_item_index);
                $list.css({ "--current-page": `${new_item_index}` });
                $position_index_label.text(dhbgApp.s('pagination_label', { 'a': (new_item_index + 1), 'b': $items.length } ));

                if (new_item_index == $items.length - 1) {
                    $next_button.css('visibility', 'hidden');
                }

                if (new_item_index > 0) {
                    $back_button.css('visibility', 'visible');
                }
                $this.trigger('jpit:pagination:changed', nextpage);
            });

            $list_buttons.append($next_button);
            // End Next button.
        $this.data('pagination', {
            moveNext: function () {
                $next_button.find('.button.next').removeAttr('disabled');
                $next_button.trigger('click');
            },
            moveBack: function () { $back_button.trigger('click'); },
            setButtonEnable: function (button, enabled) {
                if (enabled) {
                    $this.find('.button.'+button).removeAttr('disabled');
                }
                else {
                    $this.find('.button.'+button).attr('disabled', true);
                }
            },
            isLastPage: function () {
                return ($items.data('current') + 1) == total_pages;
            }
        });
        const $list_wrapper = $('<div class="layers-wrapper"></div>');
        $list_wrapper.append($list);
        $this.append($list_wrapper);
        $this.append($list_buttons);
        $this.append('<div class="clear"></div>');
        var animation = $this.attr('data-animation') || 'none';
        var duration = $this.attr('data-animation-duration') || 400;
        var ontransitionhidden = ".label_current," + $this.attr('data-pagination-transition-hidden') || '';

        function showPage(page, isnext) {
            var $page = $(page),
                $prev = isnext ? $page.prev() : $page.next();

            if (animation == 'none') {
                $prev.hide();
                $page.show();
                return;
            }

            slide($page, $prev, isnext ? 'right' : 'left');
        }

        function slide($page, $prev, dir, duration) {
            $prev.hide();
            var $hidden = $page.find(ontransitionhidden).hide();
            $page.show("slide", { direction: dir }, duration, function () {
                //$prev.hide().css('visibility', 'hidden');
                $hidden.show();
            });
        }
    });

    // ==============================================================================================
    // Programing animations
    // ==============================================================================================
    if (jpit.resources && jpit.resources.movi) {
        var index_movi = 1;
        $('.movi').each(function(){
            var $this = $(this);

            if (!$this.attr('data-name')) {
                $this.attr('data-name', 'movi_' + index_movi);
            }

            var index_layer = 1;
            $this.find('[data-movi-type]').each(function() {
                var $layer = $(this);
                $layer.addClass('movi-layer');

                if (!$layer.attr('data-name')) {
                    $layer.attr('data-name', 'movi_' + index_movi + '_' + index_layer);
                }

                jpit.resources.movi.processMoviLayer($layer);
                index_layer++;
            });

            index_movi++;

        });

        $('[data-movi-play]').each(function(){
            var $this = $(this);
            var event_name = $this.attr('data-movi-event') ? $this.attr('data-movi-event') : 'click';

            $this.on(event_name, function(){
                var movi;

                if(movi = jpit.resources.movi.movies[$this.attr('data-movi-play')]) {

                    if (!movi.tail) {
                        movi.tail = [];
                    }

                    movi.element = $(movi.selector);

                    if (!movi.main_movi) {
                        movi.main_movi = movi.element;
                    }

                    jpit.resources.movi.processMovi(movi);
                }
            });
        });

        $('[data-event-action]').each(function(){
            var $this = $(this);
            var event_name = $this.attr('data-event-name') ? $this.attr('data-event-name') : 'click';

            $this.on(event_name, function(){

                switch($this.attr('data-event-action')) {
                    case 'play_movi':
                        jpit.resources.movi.readMoviSequence($($this.attr('data-event-action-selector')), null);
                        break;
                    case 'auto_hide':
                        $this.hide();
                        break;
                    default:
                        if (jpit.resources.movi.movies.actions[$this.attr('data-event-action')]) {
                            var f = jpit.resources.movi.movies.actions[$this.attr('data-event-action')];
                            f();
                        }
                }
            });
        });

        dhbgApp.actions.beforeChangePage[dhbgApp.actions.beforeChangePage.length] = function($current_subpage) {

            jpit.resources.movi.currentMovi = null;
            $current_subpage.find('[data-movi-type]').each(function(){
                $(this).stop(true, false);
            });
        };

        dhbgApp.actions.afterChangePage[dhbgApp.actions.afterChangePage.length] = function($current_subpage) {

            $current_subpage.find('.movi').each(function(){
                var $this = $(this);
                jpit.resources.movi.readMoviSequence($this, null);
            });
        };
    }

    //Activities
    dhbgApp.standard.load_operations();
    dhbgApp.actions.startTimer = function($container, seconds) {
        var format = function (s) {
            var h = Math.floor(s / 3600);
            s = s % 3600;
            var m = Math.floor(s / 60);
            s = s % 60;
            return h > 0 ? ('0'+h).slice(-2) + ':' : '' +
                ('0'+m).slice(-2) + ':' +
                ('0'+s).slice(-2);
        };

        var $timer = $('<span class="jpit-timer">');
        var interval;
        var start = function () {
            $timer.html(format(seconds)).appendTo($container)
            var sec = seconds;
            interval = setInterval(function () {
                sec--;
                $timer.html(format(sec));
                if (sec == 0) {
                    clearInterval(interval);
                    interval = undefined;
                    $container.trigger('jpit:timer:elapsed', clock);
                }
            }, 1000);
        }
        var clock = {
            stop: function () { interval && clearInterval(interval); },
            restart: function () { start(); },
            hide: function() { $timer.hide() },
            show: function() { $timer.show() }
        };
        start();
        $container.data('clock', clock);
    };

    dhbgApp.actions.loadActivity = function($container, type, loader) {
        var scorm_id = $container.attr('data-act-id') ? $container.attr('data-act-id') : type;

        if (dhbgApp.scorm) {
            if (!dhbgApp.scorm.activities[scorm_id]) { dhbgApp.scorm.activities[scorm_id] = []; }
        }

        var el = $container.get(0);
        var ondemand = false;
        var timer = 0;
        var options = { scorm_id: scorm_id };

        if (el.hasAttribute('data-timer')) {
            timer = parseInt(el.getAttribute('data-timer'));
            timer = isNaN(timer) ? 0 : timer;
            el.removeAttribute('data-timer');
        }

        if (el.hasAttribute('data-reveal-response')) {
            options.allow_reveal = el.getAttribute('data-reveal-response') == 'true';
            el.removeAttribute('data-reveal-response');
        }

        if (el.hasAttribute('data-on-demand')) {
            ondemand = /^(any|standard)$/.test(el.getAttribute('data-on-demand'));
        }

        if (!ondemand && timer == 0) {
            loader.call(loader, $container, options);
            return;
        }

        var $start = $('<button class="button general">' + dhbgApp.s('start_activity') + '</button>');
        $container.before($start);
        var parent_class = $container.parent().attr('id');
        $container.addClass(parent_class);
        $container.hide();
        $start.on('click', function() {
            $container.show();
            loader.call(loader, $container, options);
            if (timer > 0) {
                dhbgApp.actions.startTimer($container, timer);
            }
            $start.hide();
        });

    };

    $('.jpit-activities-quiz').each(function(){
        var $this = $(this);
        dhbgApp.actions.loadActivity($this, 'quiz', dhbgApp.actions.activityQuiz);
    });

    $('.jpit-activities-droppable').each(function(){
        var $this = $(this);
        dhbgApp.actions.loadActivity($this, 'droppable', dhbgApp.actions.activityDroppable);
    });

    $('.jpit-activities-multidroppable').each(function(){
        var $this = $(this);
        dhbgApp.actions.activityMultidroppable($this);
    });

    $('.jpit-activities-cloze').each(function(){
        var $this = $(this);
        dhbgApp.actions.activityCloze($this);
    });

    $('.jpit-activities-sortable').each(function(){
        var $this = $(this);
        dhbgApp.actions.activitySortable($this);
    });

    $('.jpit-activities-check').each(function(){
        var $this = $(this);
        dhbgApp.actions.activityCheck($this);
    });

    $('.jpit-activities-mark').each(function(){
        var $this = $(this);
        dhbgApp.actions.activityMark($this);
    });

    $('.jpit-activities-form').each(function(){
        var $this = $(this);
        dhbgApp.actions.activityForm($this);
    });

    $('.jpit-activities-view').each(function(){
        var $this = $(this);
        dhbgApp.actions.activityView($this);
    });

    // ==============================================================================================
    // Open URL
    // This is processed on the end in order to not be disabled for another dynamic html and include
    // "open urls" generated by other controls.
    // ==============================================================================================
    $('.open-url').on('click', function(){
        window.open($(this).attr('data-url'));
    });

    // ==============================================================================================
    // Tooltip
    // This is processed on the end in order to not be disabled for another dynamic html and include
    // "tooltips" generated by other controls.
    // ==============================================================================================
    $('.tooltip').each(function() {

        var $this = $(this);

        var position = {};

        if ($this.attr('data-position-my')) {
            position.my =  $this.attr('data-position-my');
        }

        if ($this.attr('data-position-at')) {
            position.at =  $this.attr('data-position-at');
        }

        if ($this.attr('data-position-flipfit')) {
            position.collision =  $this.attr('data-position-flipfit');
        }

        $this.tooltip({
            content: function() {
                return '<div class="text_tooltip">' + $( this ).attr( "title" ) + '</div>';
            },
            show: null, // Show immediately.
            position: position,
            hide: { effect: "" },
            close: function(event, ui){
                ui.tooltip.hover(
                    function () {
                        $(this).stop(true).fadeTo(400, 1);
                    },
                    function () {
                        $(this).fadeOut("400", function(){
                            $(this).remove();
                        });
                    }
                );
            }
        });
    });

    // ==============================================================================================
    // Instructions
    // This is processed on the end in order to include "instructions" generated by other controls.
    // ==============================================================================================
    $('.instruction').each(function(){
        var $this = $(this);
        var cssclass = 'ion-help-circled';
        if ($this.attr('type')) {
            switch($this.attr('type')) {
                case 'info':
                    cssclass = 'ion-information-circled';
                    break;
                case 'danger':
                    cssclass = 'ion-nuclear';
                    break;
                case 'alert':
                    cssclass = 'ion-alert-circled';
                    break;
                case 'none':
                    // Not add icon.
                    return;
            }
        }
        $this.prepend('<i class="' + cssclass + '"></i>');
    });

    // ==============================================================================================
    // Print page
    // ==============================================================================================
    $('#printent_back').on('click', function(){
        $('#printent_content').hide();
        $('body').removeClass('print_mode');
        $('#printent_content div.content').empty();

        var offset_return;
        if (offset_return = $('#printent_back').data('offset_return')) {
            $("body, html").animate({
                scrollTop: offset_return
            }, 100);
        }
    });

    // ==============================================================================================
    // Form element value in a target control
    // ==============================================================================================
    dhbgApp.actions.afterChangePage[dhbgApp.actions.afterChangePage.length] = function($current_subpage){
        $current_subpage.find('.form-value-display').each(function(){
            var $this = $(this);
            var text = $($this.attr('data-element')).val();
            text = text.replace(/\n/g, '<br />');
            text = text.replace(/\t/g, '    ');
            $this.html(text);
        });
    };

    // ==============================================================================================
    // Sounds
    // ==============================================================================================
    dhbgApp.actions.autoLoadSounds($('body'));

    dhbgApp.actions.beforeChangePage[dhbgApp.actions.beforeChangePage.length] = function($current_subpage){
        if (dhbgApp.DB.loadSound) {
            dhbgApp.DB.loadSound.pause();
        }

        $current_subpage.find('video,audio').each(function() {
            $(this)[0].pause();
        });
    };


    $('main > section').each(function(index_page, value_page) {
        var $page = $(this);
        $page.addClass('page_' + index_page);
        $page.data('index-page', index_page)

        $page.find('.subpage').each(function(i, v) {
            $(this).addClass('subpage_' + i);
        });

        dhbgApp.pages[index_page] = {'id': $page.attr('id'), 'title': $page.attr('ptitle') || ''};
        dhbgApp.pages[index_page].subpages = dhbgApp.FULL_PAGES ? 1 : $('.page_' + index_page + ' .subpage').length;
        dhbgApp.DB.totalPages += dhbgApp.pages[index_page].subpages;
    });

    dhbgApp.pagesNames = [];


    $.each(dhbgApp.pages, function(i, v) {

        dhbgApp.pagesNames[v.id] = i;

        const skipInScorm = v.id === 'pag-creditos';

        if (dhbgApp.scorm && !skipInScorm) {
            dhbgApp.scorm.indexPages[i] = [];

            for (var k = 0; k < v.subpages; k++) {
                var sco = {
                    "page": i,
                    "subpage": k,
                    "visited": false,
                    "value": 1,
                    "index" : dhbgApp.scorm.scoList.length
                };

                if (dhbgApp.scorm.visited[sco.index]) {
                    sco.visited = true;
                }

                dhbgApp.scorm.indexPages[i][k] = sco.index;
                dhbgApp.scorm.scoList[sco.index] = sco;
            }
        }
    });


    if (dhbgApp.MODEL == 'scorm' && (!dhbgApp.scorm || !dhbgApp.scorm.lms)) {
        $('#not_scorm_msg').html(dhbgApp.s('scorm_not'));
        $('#not_scorm_msg').dialog({
        modal: true,
        open: function () {
            $('body').addClass('dhbgapp_fullview');
        },
        close: function () {
            $('body').removeClass('dhbgapp_fullview');
        }
    });
    }

    if (dhbgApp.scorm && dhbgApp.scorm.activities) {
        dhbgApp.scorm.activities = dhbgApp.sortObjectByProperty(dhbgApp.scorm.activities);
    }

    if (dhbgApp.MODEL == 'scorm' && dhbgApp.scorm && dhbgApp.scorm.change_sco) {
        dhbgApp.changeSco(dhbgApp.scorm.currentSco);
    }
    else {
        dhbgApp.loadPage(0, 0);
    }

    function clearWatermark(iframe,watermarkDone, shareDone) {
        const iframeBody = $(iframe)[0].contentDocument.body;
        const waterMark = $(iframeBody).find('a [data-cy="eduWatermark"]');
        const shareButton = $(iframeBody).find('[data-cy="shareIcon"]');
        if (waterMark.length) {
            waterMark.parent().parent().remove();
            watermarkDone = true;
        }
        if (shareButton.length) {
            shareButton.parent().parent().remove();
            shareDone = true;
        }
        if (!watermarkDone || !shareDone) {
            setTimeout(() => {
                clearWatermark(iframe, watermarkDone, shareDone)
            }, 500);
        }
    }

    const $geniallyEmbed = $('.genially-embed');
    if ($geniallyEmbed.length) {
        $geniallyEmbed.each(function (){
            let shareDone = false;
            let watermarkDone = false;
            clearWatermark(this,watermarkDone, shareDone)

        })
    }
};


//=========================================================================
// Init functions
//=========================================================================
dhbgApp.standard.load_operations = function() {

    dhbgApp.changeSco = function(index) {
        var sco = dhbgApp.scorm.scoList[index];

        dhbgApp.scorm.currentSco = index;

        dhbgApp.loadPage(sco.page, sco.subpage);
    };



    dhbgApp.printProgress = function() {
        if (typeof dhbgApp.scorm == 'object') {
            var progress = dhbgApp.scorm.getProgress();

            if (!isNaN(progress)) {
                if (dhbgApp.loadProgress) {
                    dhbgApp.loadProgress(progress);
                }
            }
            else {
                $('.measuring-progress').hide();
            }
        }
    };

    dhbgApp.loadPageN = function(name) {
        dhbgApp.loadPage(dhbgApp.pagesNames[name]);
    };

    dhbgApp.loadPage = function(npage, nsubpage) {

        if (!nsubpage) {
            nsubpage = 0;
        }

        if(npage == 0){
            $('[previous-page]').css('visibility', 'hidden');
        }
        else{
            $('[previous-page]').css('visibility', 'visible');
        }

        if(npage == dhbgApp.pages.length -1){
            $('[next-page]').css('visibility', 'hidden');
        }
        else{
            $('[next-page]').css('visibility', 'visible');
        }

        if (npage != dhbgApp.DB.currentPage) {

            var page = dhbgApp.pages[npage];
            $('nav [data-page]').removeClass('current').parents().removeClass('current');

            $('nav [data-page="' + page.id + '"]').addClass('current').parents().addClass('current');

            // If subpages mode is enabled.
            if (!dhbgApp.FULL_PAGES) {
                var $nav = $('[subpages-menu]');
                var $node;

                $nav.empty();

                if (page.subpages > 1) {

                    var sco;
                    for(var i = 0; i < page.subpages; i++) {

                        $node = $('<li class="button">' + (i+1) + '</li>');
                        if (i == 0) {
                            $node.addClass('current visited');
                        }

                        if (dhbgApp.scorm) {
                            sco = dhbgApp.scorm.scoList[dhbgApp.scorm.indexPages[npage][i]];

                            if (sco.visited) {
                                $node.addClass('visited');
                            }
                        }

                        $node.attr('spage', i);
                        $node.on('mouseover', dhbgApp.defaultValues.buttonover);
                        $node.on('mouseout', dhbgApp.defaultValues.buttonout);

                        $node.on('click', function() { dhbgApp.loadSubPage(npage, parseInt($(this).attr('spage'))); });

                        $nav.append($node);
                    }
                }
            }

            // Only print the title page if exists a container with CSS class ".page-title"
            var $pagetitle_box = $('.page-title');
            if ($pagetitle_box.length > 0) {
                $pagetitle_box.html(page.title);
            }

        }

        if (dhbgApp.FULL_PAGES) {
            dhbgApp.loadFullPage(npage, nsubpage);
        }
        else {
            dhbgApp.loadSubPage(npage, nsubpage);
        }

        dhbgApp.DB.currentPage = npage;
        dhbgApp.printNumberPage(npage, nsubpage);

    };

    dhbgApp.loadSubPage = function (npage, nsubpage) {

        if (dhbgApp.DB.currentSubPage != nsubpage || dhbgApp.DB.currentPage != npage) {

            var $nav = $('[subpages-menu]');
            var $current_subpage = $nav.find('.current');

            // Actions before change page.
            $.each(dhbgApp.actions.beforeChangePage, function(i, v){
                v($current_subpage);
            });

            if (nsubpage == 0 && npage == 0) {
                $('[previous-page]').css('visibility', 'hidden');
            }
            else {
                $('[previous-page]').css('visibility', 'visible');
            }

            if ((nsubpage + 1) >= dhbgApp.pages[npage].subpages && (npage + 1) == dhbgApp.pages.length) {
                $('[next-page]').css('visibility', 'hidden');
            }
            else {
                $('[next-page]').css('visibility', 'visible');
            }

            $current_subpage.removeClass('current');

            $nav.find('li[spage=' + nsubpage + ']').addClass('current');

            var $current = $('main > section .subpage.current');

            var $new_subpage = $('main > section.page_' + npage + ' .subpage_' + nsubpage);

            if ($current.length > 0) {
                $('[previous-page], [next-page]').addClass('disabled');
                $current.hide(dhbgApp.transition, dhbgApp.transitionOptions, dhbgApp.transitionDuration, function() {
                    $('main .subpage').removeClass('current');

                    $('main > section').hide();
                    $('html,body').scrollTop(0);
                    $('main > section.page_' + npage).show();

                    // Hack by multiple subpages selecteds in fast clicks.
                    $('main .subpage').hide();

                    $new_subpage.addClass('current');
                    $new_subpage.show(dhbgApp.transition, dhbgApp.transitionOptions, dhbgApp.transitionDuration, function(){
                        dhbgApp.eachLoadPage($new_subpage);
                        $('[previous-page], [next-page]').removeClass('disabled');
                    });
                });
            }
            else {
                $('main .subpage').hide();
                $('main > section').hide();
                $('main > section.page_' + npage).show();

                $new_subpage.show(dhbgApp.transition, dhbgApp.transitionOptions, dhbgApp.transitionDuration, function(){
                    dhbgApp.eachLoadPage($new_subpage);
                });
                $new_subpage.addClass('current');
            }

            if (dhbgApp.scorm) {
                const index = dhbgApp.scorm.indexPages
                    && dhbgApp.scorm.indexPages[npage]
                    && dhbgApp.scorm.indexPages[npage][nsubpage];
                if (index !== undefined) {
                    dhbgApp.scorm.saveVisit(dhbgApp.scorm.indexPages[npage][nsubpage]);
                }
            }

            dhbgApp.DB.currentSubPage = nsubpage;

            // Actions in change page.
            $.each(dhbgApp.actions.afterChangePage, function(i, v){
                v($new_subpage);
            });
        }

        dhbgApp.printNumberPage(npage, nsubpage);
    };

    dhbgApp.loadFullPage = function (npage, nsubpage) {

        if (dhbgApp.DB.currentPage != npage) {

            var $current_page = $('main > section.current');

            if ($current_page.length > 0) {
                // Actions before change page.
                $.each(dhbgApp.actions.beforeChangePage, function(i, v){
                    v($current_page);
                });
            }

            if (npage == 0) {
                $('[previous-page]').css('visibility', 'hidden');
            }
            else {
                $('[previous-page]').css('visibility', 'visible');
            }

            if ((npage + 1) == dhbgApp.pages.length) {
                $('[next-page]').css('visibility', 'hidden');
            }
            else {
                $('[next-page]').css('visibility', 'visible');
            }

            var $new_page = $('main > section.page_' + npage);

            dhbgApp.DB.currentSubPage = nsubpage;

            if ($current_page.length > 0) {
                $('[previous-page], [next-page]').addClass('disabled');
                $current_page.hide(dhbgApp.transition, dhbgApp.transitionOptions, dhbgApp.transitionDuration, function() {
                    $current_page.removeClass('current');

                    $new_page.addClass('current');
                    $new_page.show(dhbgApp.transition, dhbgApp.transitionOptions, dhbgApp.transitionDuration, function(){
                        dhbgApp.eachLoadPage($new_page);
                        $('[previous-page], [next-page]').removeClass('disabled');
                    });
                });
            }
            else {
                $new_page.show(dhbgApp.transition, dhbgApp.transitionOptions, dhbgApp.transitionDuration, function(){
                    dhbgApp.eachLoadPage($new_page);
                });
                $new_page.addClass('current');
            }

            if (dhbgApp.scorm) {
                const index = dhbgApp.scorm.indexPages
                    && dhbgApp.scorm.indexPages[npage]
                    && dhbgApp.scorm.indexPages[npage][nsubpage];
                if (index !== undefined) {
                    dhbgApp.scorm.saveVisit(dhbgApp.scorm.indexPages[npage][nsubpage]);
                }
            }

        }
        dhbgApp.printNumberPage(npage, nsubpage);
    };

    dhbgApp.printNumberPage = function (page, subpage) {

        dhbgApp.printProgress();

        const shouldChangePage =(dhbgApp.scorm && dhbgApp.scorm.indexPages.length > page && dhbgApp.scorm.indexPages[page].length > subpage) || (dhbgApp.pages[page]?.id === "pag-creditos")
        
        if (shouldChangePage) {
            var current = dhbgApp.FULL_PAGES ? page : dhbgApp.scorm.indexPages[page][subpage];
            $('#page_number').text((current + 1) + '/' + dhbgApp.DB.totalPages);
        }
    };

    dhbgApp.eachLoadPage = function($new_subpage) {
        $new_subpage.find('img.animation').each(function () {
            var $this = $(this);
            var img_src = $this.attr('src');
            $this.attr('src', '');
            $this.attr('src', img_src + '?' + (new Date().getTime()));
        });

        //Actions in change page
        $.each(dhbgApp.actions.afterChangePage, function(i, v){
            v($new_subpage);
        });
    };

    dhbgApp.actions.autoLoadSounds = function ($parent) {

        $parent.find('[data-sound]').each(function(){
            var $this = $(this);

            $this.on('click', function() {
                dhbgApp.DB.loadSound.setAttribute('src', 'content/sounds/' + $this.attr('data-sound'));
                dhbgApp.DB.loadSound.load();
                dhbgApp.DB.loadSound.play();

                $this.addClass('sound_loading');
                dhbgApp.DB.loadSound.onloadeddata = function(){ $this.removeClass('sound_loading'); };

            });
        });
    };

    dhbgApp.actions.activityQuiz = function ($this, options) {
        var scorm_id = options.scorm_id;
        var questions = [], activityOptions = {};
        var feedbacktrue = dhbgApp.s('answer_corrent'), feedbackfalse = dhbgApp.s('answer_wrong');
        var html_body = $this.html();

        if ($this.find('> feedback correct').text() != '') {
            feedbacktrue = $this.find('> feedback correct').html();
        }

        if ($this.find('> feedback wrong').text() != '') {
            feedbackfalse = $this.find('> feedback wrong').html();
        }

        activityOptions.shuffleQuestions = $this.attr('data-shuffle') && $this.attr('data-shuffle') != 'true' ? false : true;
        activityOptions.prefixType       = $this.attr('data-prefixtype') ? $this.attr('data-prefixtype') : jpit.activities.quiz.prefixes.none;
        activityOptions.requiredAll      = $this.attr('data-requiredall') && $this.attr('data-requiredall') != 'true' ? false : true;
        activityOptions.paginationNumber = $this.attr('data-paginationnumber') ? parseInt($this.attr('data-paginationnumber')) : 1;
        var allowRetry = !($this.attr('data-allow-retry') === 'false');
        var modalFeedback = true && $this.attr('data-modal-feedback');

        var count_questions = $this.find('question[type!="label"]').length;
        var question_weight = 100 / count_questions;

        $this.find('question').each(function(){ 
            var $question = $(this);
            var q;
            var question_options = {};
            var q_feedbacktrue = feedbacktrue, q_feedbackfalse = feedbackfalse, q_feedbackall = '';

            if ($question.find('feedback correct').text() != '') {
                q_feedbacktrue = $question.find('feedback correct').html();
            }

            if ($question.find('feedback wrong').text() != '') {
                q_feedbackfalse = $question.find('feedback wrong').html();
            }

            if ($question.find('feedback all').text() != '') {
                q_feedbackall = $question.find('feedback all').html();
            }

            question_options.shuffleAnswers = $question.attr('data-shuffle') && $question.attr('data-shuffle') != 'true' ? false : true;
            question_options.prefixType = $question.attr('data-prefixtype') ? $question.attr('data-prefixtype') : jpit.activities.quiz.prefixes.capital;
            question_options.displayFeedback = true;
            question_options.feedbackIfTrue = q_feedbacktrue;
            question_options.feedbackIfFalse = q_feedbackfalse;
            question_options.feedbackAll = q_feedbackall;
            question_options.weight = question_weight;

            switch($question.attr('type')) {
                case 'simplechoice':
                    var answers = [];
                    var $optionlist = $question.find('ul');
                    var correct = 0;

                    $optionlist.find('li').each(function(i, v){
                        var $opt = $(this);
                        answers[answers.length] = $opt.html();

                        if ($opt.attr('data-response') && $opt.attr('data-response') == 'true') {
                            correct = i;
                        }
                    });

                    q = new jpit.activities.quiz.question.simplechoice($question.find('description').html(), answers, correct, question_options);

                    break;
                case 'complete':
                    var $paragraph = $question.find('p.item');
                    var correct = 0;

                    $paragraph.find('.answers li').each(function(i, v){
                        var $opt = $(this);

                        if ($opt.attr('data-response') && $opt.attr('data-response') == 'true') {
                            correct = i;
                        }
                    });

                    q = new jpit.activities.quiz.question.complete($question.find('description').html(), $paragraph, correct, question_options);

                    break;
                case 'label':
                    var text = $question.find('text').html();
                    q = new jpit.activities.quiz.question.label($question.find('description').html(), text, question_options);

                    break;
                case 'multichoice':
                    var answers = [];
                    var $optionlist = $question.find('ul');
                    var correct = [];

                    $optionlist.find('li').each(function(i, v){
                        var $opt = $(this);
                        answers[answers.length] = $opt.html();

                        if ($opt.attr('data-response') && $opt.attr('data-response') == 'true') {
                            correct[correct.length] = i;
                        }
                    });

                    q = new jpit.activities.quiz.question.multichoice($question.find('description').html(), answers, correct, question_options);

                    break;
                case 'defineterm':
                    var terms = [];
                    var $optionlist = $question.find('ul');
                    var correct = [];

                    $optionlist.find('li').each(function(i, v){
                        var $opt = $(this);
                        terms[terms.length] = $opt.html();
                        correct[correct.length] = $opt.attr('data-response');
                    });

                    question_options.caseSensitive = $question.attr('data-casesensitive') ? $question.attr('data-casesensitive') : false;
                    question_options.keySensitive = $question.attr('data-keysensitive') ? $question.attr('data-keysensitive') : false;
                    question_options.caseSensitive = $question.attr('data-casesensitive') ? $question.attr('data-casesensitive') : false;
                    q = new jpit.activities.quiz.question.defineterm($question.find('description').html(), terms, correct, question_options);

                    break;
                case 'multisetchoice':
                    var answers = [];
                    var $optionlist = $question.find('ul');
                    var correctkeys = [], correct = [];

                    $optionlist.find('li').each(function(i, v){
                        var $opt = $(this);
                        answers[answers.length] = $opt.html();

                        if (!correctkeys[$opt.attr('data-response')]) {
                            correctkeys[$opt.attr('data-response')] = [];
                        }
                        correctkeys[$opt.attr('data-response')].push(i);

                    });

                    for (var key in correctkeys) {
                        if (correctkeys.hasOwnProperty(key)) {
                            correct.push(correctkeys[key]);
                        }
                    }

                    q = new jpit.activities.quiz.question.multisetchoice($question.find('description').html(), answers, correct, question_options);

                    break;
            }

            questions[questions.length] = q;
        });

        var d_answer_buttons = {};
        var ok = dhbgApp.s('accept');
        d_answer_buttons[ok] = function() { $(this).dialog('close'); };
        var $dialog_answer_required = $('<div>' + dhbgApp.s('answer_required') + '</div>').dialog(
            {
                modal: true,
                autoOpen: false,
                buttons: d_answer_buttons,
                close: function () {
                    $('body').removeClass('dhbgapp_fullview');
                },
                open: function () {
                    $('body').addClass('dhbgapp_fullview');
                },
            }
        );

        var $box_questions = $('<div class="box_content"></div>');
        var $box_end = $('<div class="box_end" style="display:none"></div>');

        var add_restart_button = function () {
            if (!allowRetry) return;
            var $button_again = $('<button class="button general">' + dhbgApp.s('restart_activity') + '</button>');
            $button_again.on('click', function(){
                $this.empty();
                $this.html(html_body);
                dhbgApp.actions.activityQuiz($this, options);
                dhbgApp.actions.autoLoadSounds($this);
                $this.data('clock') && $this.data('clock').restart();
            });
            $box_end.append($button_again);
        }

        var add_end_button = function () {
            var $button_end = $('<button class="button general">' + dhbgApp.s('end_activity') + '</button>');
            $button_end.on('click', function(){
                $box_end.empty().hide();
                $.each(questions, function(idx, q) {
                    q.resolve && q.resolve();
                });
                $this.data('clock') && $this.data('clock').hide();
            });
            $box_end.append($button_end);
        }

        var activity = new jpit.activities.quiz.activity($box_questions, questions, activityOptions);
        activity.verified = [];

        var $verify = $('<button class="button general">' + dhbgApp.s('verify') + '</button>');
        $verify.on('mouseover', dhbgApp.defaultValues.buttonover);
        $verify.on('mouseout', dhbgApp.defaultValues.buttonout);
        $verify.on('click', function() {
            // If it is not answered.
            if(!activity.showPartialFeedback(activity.currentPagination)){
                $dialog_answer_required.dialog('open');
            }
            else {
                activity.verified[activity.currentPagination] = true;
                var lower = (activity.currentPagination * activity.paginationNumber) - activity.paginationNumber; // Before question index.
                var top = (activity.currentPagination * activity.paginationNumber); // Next question index.
                for(var i = lower; i < top; i++){
                    if(activity.finalQuestionList[i] != undefined) {
                        activity.finalQuestionList[i].showFeedback();
                        activity.finalQuestionList[i].disableQuestion(); // Disable questions in current page.
                    }
                }

                $(this).hide();

                // If all questions were answered.
                if(activity.isFullAnswered()){
                    $this.data('clock') && $this.data('clock').stop(); //Stop timer if any

                    for(var i = 0; i < activity.finalQuestionList.length; i++){
                        if(activity.finalQuestionList[i] != undefined && activity.finalQuestionList[i].isQualifiable()) {
                            activity.finalQuestionList[i].showFeedback();
                            activity.finalQuestionList[i].disableQuestion(); // Disable questions in current page.
                            activity.verified[i + 1] = true;
                        }
                    }

                    var weight = Math.round(activity.getSolvedWeight());

                    if (dhbgApp.scorm) {
                        dhbgApp.scorm.activityAttempt(scorm_id, weight);
                    }

                    dhbgApp.printProgress();

                    if (count_questions > 1) {
                        const msg = dhbgApp.actions.getFeedbackMsg(weight);
                        $box_end.empty();
                        $box_end.append(msg).show();
                    }
                    else {
                        $box_end.show();
                    }

                    if (weight < 100) {
                        add_restart_button();
                    }
                    $(dhbgApp).trigger('jpit:activity:completed', [$this, {
                        id: scorm_id,
                        weight: weight
                    }]);
                }
            }

        });

        var verify_display_function = function () {
            if (activity.verified[activity.currentPagination]) {
                $verify.hide();
            }
            else {
                $verify.show();
            };

            var lower = (activity.currentPagination * activity.paginationNumber) - activity.paginationNumber; // Before question index.
            var top = (activity.currentPagination*activity.paginationNumber); // Next question index.
            for(var i = lower; i < top; i++){
                if(activity.finalQuestionList[i] != undefined  && !activity.finalQuestionList[i].isQualifiable()) {
                    $verify.hide();
                }
            }

        };

        activity.container.find('.jpit_activities_quiz_paginator_previous').on('click', verify_display_function);
        activity.container.find('.jpit_activities_quiz_paginator_next').on('click', verify_display_function);

        var $verify_box = $('<div class="verify_box"></div>');
        $verify_box.append($verify);
        $box_questions.find('.jpit_activities_quiz_board').wrap("<div class='board_wrapper'></div>");
        $box_questions.find('.board_wrapper').after($verify_box);

        $this.empty();
        $this.append($box_questions);
        $this.append($box_end);
        verify_display_function();

        $this.on('jpit:timer:elapsed', function(){
            $.each(questions, function(idx, q) { q.disableQuestion(); });
            $verify_box.hide();
            add_restart_button();
            options.allow_reveal && add_end_button();
            $box_end.show();
            $(dhbgApp).trigger('jpit:activity:completed', [$this, {
                id: scorm_id,
                weight: 0
            }]);
        });
    };

    dhbgApp.actions.activityDroppable = function ($this, options) {
        var activity;
        var unique_id = 'activity_droppable_' + dhbgApp.rangerand(0, 1000, true);
        var feedbacktrue, feedbackfalse;
        var html_body = $this.html();
        var scorm_id = options.scorm_id;

        var helper = '';
        if ($this.attr('data-droppable-content-inner') && $this.attr('data-droppable-content-helper')) {
            helper = $this.attr('data-droppable-content-helper');
        }

        var $box_end = $this.find('.box_end');
        $box_end.hide();

        if ($this.find('feedback correct').text() != '') {
            feedbacktrue = $this.find('feedback correct').html();
        }

        if ($this.find('feedback wrong').text() != '') {
            feedbackfalse = $this.find('feedback wrong').html();
        }

        $this.find('feedback').empty();

        var activityOptions = {
            'autoResolve': false,
            'continueResolve': false,
            'holdCorrects': false,
            'multiTarget': 1,
            'autoAlignNodes': false,
            'requiredAll': false,
            'required_all_pairs': true,
            'draggableContainer': $('#middle')
        };
        var allowRetry = !($this.attr('data-allow-retry') === 'false');
        var modalFeedback = true && $this.attr('data-modal-feedback');

        var type_verification = $this.attr('data-verify-type') ? $this.attr('data-verify-type') : 'source';

        var multi;
        if (multi = $this.attr('data-target-multi')) {
            activityOptions.multiTarget = multi;
        }

        var autoalign;
        if (autoalign = $this.attr('data-autoalign')) {
            activityOptions.autoAlignNodes = autoalign === 'true';
        }
        // Build the board.
        var origins = [], targets = [], pairs = [],  pair_indexs = [];

        var i = 0;
        $this.find('[data-group]').each(function(){
            var $item = $(this);
            $item.attr('id', unique_id + '_origin_' + i);
            $item.addClass('draggable');
            origins[origins.length] = $item;

            $this.find('[data-target-group="' + $item.attr('data-group') + '"]').each(function(){
                pairs[pairs.length] = {'origin': $item, 'target': $(this)};
            });

            $item.removeAttr('data-group');
            i++;
        });

        $this.find('[data-target-group]').each(function(){
            var $item = $(this);
            $item.attr('id', unique_id + '_target_' + $item.attr('data-target-group'));
            $item.addClass('droppable');
            targets[targets.length] = $item;
            $item.removeAttr('data-target-group');
        });

        var add_restart_button = function() {
            if (!allowRetry) return;
            var $button_again = $('<button class="button general">' + dhbgApp.s('restart_activity') + '</button>');
            $button_again.on('click', function(){
                $(dhbgApp).trigger('jpit:activity:restart', [$this, {
                    id: scorm_id
                }]);
                $box_end.empty().hide();
                $this.find('.draggable,.droppable').removeClass('wrong correct');
                $this.removeClass('completed');
                activity.resetStage();
                $this.data('clock') && $this.data('clock').restart();
            });
            $box_end.append($button_again);
        };

        var add_end_button = function () {
            var $button_end = $('<button class="button general">' + dhbgApp.s('end_activity') + '</button>');
            $button_end.on('click', function(){
                $box_end.empty().hide();
                $this.find('.draggable,.droppable').removeClass('wrong correct');
                $.each(pairs, function(idx, pair) {
                    pair.origin.addClass('dropped').appendTo(pair.target);
                });
                $this.data('clock') && $this.data('clock').hide();
            });
            $box_end.append($button_end);
        }

        activityOptions.onDrop = function($dragEl) {

            // var $dropzone = this;
            //     if ($this.attr('data-adjust-size') && $this.attr('data-adjust-size') == 'true') {
            //         $dragEl.width($dropzone.width());
            //         $dragEl.height($dropzone.height());
            //     } from mobile
            $dragEl.trigger('click');

            var end = type_verification == 'target' ? activity.isComplete() : activity.isFullComplete();

            $(dhbgApp).trigger('jpit:activity:drop', [$this, {
                id: scorm_id,
                dragEl: $dragEl
            }]);

            if (!end) return;

             $this.data('clock') && $this.data('clock').stop();

            var weight;

            if (type_verification == 'target') {
                weight = Math.round(activity.countCorrect() * 100 / targets.length);
            }
            else {
                weight = Math.round(activity.countCorrect() * 100 / pairs.length);
            }
            activity.disable();

            if (dhbgApp.scorm) {
                dhbgApp.scorm.activityAttempt(scorm_id, weight)
            }
            dhbgApp.printProgress();

            var msg =  dhbgApp.actions.getFeedbackMsg(weight);
            var $msg = $(msg);
            var $close;
            if ($box_end.attr('data-enable-close-button')) {
                $close = $('<span class="icon_more button"></span>').on('click', function() {
                    $box_end.empty().hide();
                });
                $msg.append($close);
            }

            var continueWith = $this.attr('data-continue-with');
            if (continueWith) {
                var $continue = $('<button class="general">Continuar</button>').on('click', function() {
                    $(continueWith).show(200);
                    $("html, body").animate({ scrollTop: $(continueWith).offset().top }, 500);
                    $box_end.empty().hide();
                });
                $close && $close.remove();
                $msg.append($continue);
            }

            $box_end.append($msg).show();
            $this.addClass('completed');

            if (weight < 99) {
                add_restart_button();
            }

            $this.find('.draggable,.droppable').addClass('wrong');

            var corrects = activity.getCorrects();

            if (corrects.length > 0) {
                $.each(corrects, function(index, correct){
                    correct.o.removeClass('wrong').addClass('correct');
                    correct.t.removeClass('wrong').addClass('correct');
                });
            }

            $(dhbgApp).trigger('jpit:activity:completed', [$this, {
                id: scorm_id,
                weight: weight
            }]);
        };

        $this.on('jpit:timer:elapsed', function(){
            activity.disable();
            add_restart_button();
            options.allow_reveal && add_end_button();
            $box_end.show();
            $(dhbgApp).trigger('jpit:activity:completed', [$this, {
                id: scorm_id,
                weight: 0
            }]);
        });

        activity = new jpit.activities.droppable.board(activityOptions, origins, targets, pairs);
    };

    dhbgApp.actions.activityMultidroppable = function ($this) {

        var scorm_id = $this.attr('data-act-id') ? $this.attr('data-act-id') : 'multidroppable';
        var feedbacktrue = '', feedbackfalse = '';

        if (dhbgApp.scorm) {
            if (!dhbgApp.scorm.activities[scorm_id]) { dhbgApp.scorm.activities[scorm_id] = []; }
        }

        var activity;
        var unique_id = 'activity_multidroppable_' + dhbgApp.rangerand(0, 1000, true);

        var $box_end = $this.find('.box_end');
        $box_end.hide();

        if ($this.find('feedback correct').text() != '') {
            feedbacktrue = $this.find('feedback correct').html();
        }

        if ($this.find('feedback wrong').text() != '') {
            feedbackfalse = $this.find('feedback wrong').html();
        }

        $this.find('feedback').empty();

        var $targets = $this.find( ".target" );
        $targets.sortable({
            revert: true
        });

        // Build the board.
        var origins = [], targets = [], pairs = [],  pair_indexs = [];

        var i = 0;
        $this.find('[data-group]').each(function(){
            var $item = $(this);
            $item.attr('id', unique_id + '_origin_' + i);
            $item.addClass('draggable');
            origins[origins.length] = $item;

            $this.find('[data-target-group="' + $item.attr('data-group') + '"]').each(function() {
                pairs[pairs.length] = {'origin': $item, 'target': $(this)};
            });

            i++;
        }).draggable({
            containment: $this,
            zIndex: 3,
            connectToSortable: $targets,
            revert: "invalid",
            start: function(event, ui) {
                $(this).addClass('jpit_activities_jpitdroppable_dragstart');
            },
            stop: function(event, ui) {
                $(this).removeClass('jpit_activities_jpitdroppable_dragstart');
            }
        });

        $this.find('[data-target-group]').each(function(){
            var $item = $(this);
            $item.attr('id', unique_id + '_target_' + $item.attr('data-target-group'));
            $item.addClass('droppable');
            targets[targets.length] = $item;
        }).droppable({
            drop: function( event, ui ) {
            },
            out: function(event, ui) {
            }
        });

        var $verify = $this.find('button.verify');
        var $continue = $this.find('button.continue');

        $verify.on('click', function () {
            var dropped = $this.find('.box_targets .draggable');

            if (dropped.length >= origins.length) {

                $this.find('[data-group]').draggable( "disable" );
                $targets.sortable( "disable" );

                var corrects = 0;
                $.each(targets, function(i, $k){
                    corrects += $k.find('[data-group="' + $k.attr('data-target-group') + '"]').addClass('correct disabled').length;
                    $k.find('[data-group!="' + $k.attr('data-target-group') + '"]').addClass('wrong disabled');
                });

                $(this).hide();

                var weight = Math.round(corrects * 100 / origins.length);

                if (dhbgApp.scorm) {
                    dhbgApp.scorm.activityAttempt(scorm_id, weight)
                }
                dhbgApp.printProgress();

                var $msg;
                if (weight >= dhbgApp.evaluation.approve_limit) {
                    $msg = $('<div class="correct"></div>');
                    $msg.append(feedbacktrue ? feedbacktrue : dhbgApp.s('all_correct_percent', weight));
                }
                else {
                    $msg = $('<div class="wrong"></div>');
                    $msg.append(feedbackfalse ? feedbackfalse : dhbgApp.s('some_correct_percent', weight));
                }

                $box_end.append($msg).show();

                if (weight < 100) {
                    $continue.show();
                }
                $(dhbgApp).trigger('jpit:activity:completed', [$this, {
                    id: scorm_id,
                    weight: weight
                }]);
            }
            else {
                var d_drop_buttons = {};
                var ok = dhbgApp.s('accept');
                d_drop_buttons[ok] = function() { $(this).dialog('close'); };
                $('<div>' + dhbgApp.s('drop_required') + '</div>').dialog({ modal: true, autoOpen: true, buttons: d_drop_buttons });
            }
        });

        $continue.on('click', function () {

            $box_end.empty().hide();
            $this.find('.draggable').removeClass('wrong').removeClass('correct').removeClass('disabled');

            $this.find('[data-group]').draggable( "enable" );
            $targets.sortable( "enable" );

            $continue.hide();
            $verify.show();
        });


        $this.find( ".draggable" ).disableSelection();
    };

    dhbgApp.actions.activityCloze = function ($this) {

        var scorm_id = $this.attr('data-act-id') ? $this.attr('data-act-id') : 'cloze';

        if (dhbgApp.scorm) {
            if (!dhbgApp.scorm.activities[scorm_id]) { dhbgApp.scorm.activities[scorm_id] = []; }
        }

        $(dhbgApp).trigger('jpit:activity:rendered', [$this, {
            id: scorm_id
        }]);

        var mark_parent = $this.attr('data-parent-mark-selector') ? $this.attr('data-parent-mark-selector') : false;

        var activity;
        var unique_id = 'activity_cloze_' + dhbgApp.rangerand(0, 1000, true);
        var feedbacktrue = '', feedbackfalse = '';
        var allowRetry = !($this.attr('data-allow-retry') === 'false');
        var modalFeedback = true && $this.attr('data-modal-feedback');

        var html_body = $this.html();
        var $box_end = $this.find('.box_end');
        $box_end.hide();

        if ($this.find('feedback correct').text() != '') {
            feedbacktrue = $this.find('feedback correct').html();
        }

        if ($this.find('feedback wrong').text() != '') {
            feedbackfalse = $this.find('feedback wrong').html();
        }
        $this.find('feedback').empty();

        var d_answer_buttons = {};
        var ok = dhbgApp.s('accept');
        d_answer_buttons[ok] = function() { $(this).dialog('close'); };
        var $dialog_answer_required = $('<div>' + dhbgApp.s('cloze_required') + '</div>').dialog({ modal: true, autoOpen: false, buttons: d_answer_buttons });

        // Build the board.
        var words = [];
        var i = 1;

        activity = new jpit.activities.cloze.activity($this);

        var $verify = $('<button class="button general">' + dhbgApp.s('verify') + '</button>');
        $verify.on('mouseover', dhbgApp.defaultValues.buttonover);
        $verify.on('mouseout', dhbgApp.defaultValues.buttonout);

        $verify.on('click', function() {
            $(dhbgApp).trigger('jpit:activity:verify', [$this, {
                id: scorm_id
            }]);

            if (!activity.fullAnswered()){
                $dialog_answer_required.dialog('open');
            }
            else {
                $verify.hide();

                var weight = Math.round(activity.weight());

                if (dhbgApp.scorm) {
                    dhbgApp.scorm.activityAttempt(scorm_id, weight)
                }
                dhbgApp.printProgress();

                var msg;
                if (weight >= dhbgApp.evaluation.approve_limit) {
                    msg = '<div class="correct">' + (feedbacktrue ? feedbacktrue : dhbgApp.s('all_correct_percent', weight)) + '</div>';
                }
                else {
                    msg = '<div class="wrong">' + (feedbackfalse ? feedbackfalse : dhbgApp.s('some_correct_percent', weight)) + '</div>';
                }

                $box_end.append(msg).show();

                activity.disable();
                activity.highlight('correct', 'wrong');

                if (mark_parent) {
                    $this.find('.wrong').parents(mark_parent).addClass('wrong');
                    $this.find('.correct').parents(mark_parent).addClass('correct');
                }

                if (weight < 100 && allowRetry) {
                    var $button_again = $('<button class="button general">' + dhbgApp.s('continue_activity') + '</button>');
                    $button_again.on('click', function(){

                        $(dhbgApp).trigger('jpit:activity:again', [$this, {
                            id: scorm_id
                        }]);

                        $box_end.empty();
                        $box_end.hide();
                        $this.find('.correct').removeClass('correct');
                        $this.find('.wrong').removeClass('wrong');
                        activity.enable();
                        $verify.show();
                    });

                    $box_end.append($button_again);
                }

                $(dhbgApp).trigger('jpit:activity:completed', [$this, {
                    id: scorm_id,
                    weight: weight
                }]);
            }
        });

        var $box_verify = $('<div class="verify_container"></div>');
        $box_verify.append($verify);
        $box_verify.insertAfter($box_end);

    };

    dhbgApp.actions.activityCheck = function ($this) {
        var scorm_id = $this.attr('data-act-id') ? $this.attr('data-act-id') : 'check';

        if (dhbgApp.scorm) {
            if (!dhbgApp.scorm.activities[scorm_id]) { dhbgApp.scorm.activities[scorm_id] = []; }
        }

        var words = [];
        $this.find('words li').each(function (k, word) {
            var $word = $(word);
            var value = $word.attr('data-val') && $word.attr('data-val') == 'true';
            words[words.length] = new jpit.activities.check.word($word.html(), value);
        });

        $this.find('words').empty();

        var properties = {
            "onfinished": function (a) {
                var weight = Math.round(a.countCorrect() * 100 / a.words.length);

                if (a.finishedAll()) {
                    weight = 100;
                }

                const msg =  dhbgApp.actions.getFeedbackMsg(weight);
                const $msg = $(msg);
                const $box_end = $this.find(".box_end");
                $box_end.empty().append($msg);

                if (dhbgApp.scorm) {
                    dhbgApp.scorm.activityAttempt(scorm_id, weight);
                }
                dhbgApp.printProgress();
                $(dhbgApp).trigger('jpit:activity:completed', [$this, {
                    id: scorm_id,
                    weight: weight
                }]);
            },
        };

        // Build the board.
        var activity = new jpit.activities.check.init($this, words, properties);
        activity.noneString = dhbgApp.s('none');

    };

    dhbgApp.actions.activityMark = function ($this) {

        var scorm_id = $this.attr('data-act-id') ? $this.attr('data-act-id') : 'mark';

        if (dhbgApp.scorm) {
            if (!dhbgApp.scorm.activities[scorm_id]) { dhbgApp.scorm.activities[scorm_id] = []; }
        }

        var activity;
        var unique_id = 'activity_mark_' + dhbgApp.rangerand(0, 1000, true);
        var feedbacktrue = null, feedbackfalse = null;
        var html_body = $this.html();
        var $box_verify = $('<div class="verify_container"></div>');
        var $box_end = $('<div class="box_end"></div>');
        var allowRetry = !($this.attr('data-allow-retry') === 'false');
        var modalFeedback = true && $this.attr('data-modal-feedback');

        $box_end.hide();
        $box_verify.append($box_end);

        if ($this.find('feedback correct').text() != '') {
            feedbacktrue = $this.find('feedback correct').html();
        }

        if ($this.find('feedback wrong').text() != '') {
            feedbackfalse = $this.find('feedback wrong').html();
        }

        $this.find('feedback').empty();

        var d_answer_buttons = {};
        var ok = dhbgApp.s('accept');
        d_answer_buttons[ok] = function() { $(this).dialog('close'); };
        var $dialog_answer_required = $('<div>' + dhbgApp.s('mark_required') + '</div>').dialog({ modal: true, autoOpen: false, buttons: d_answer_buttons });

        // Build the board.
        var words = [];
        var i = 1;

        var mark_type = $this.attr('data-mark-type') ? $this.attr('data-mark-type') : 'rectangle';

        activity = new jpit.activities.mark.activity($this, mark_type);

        var $verify = $('<button class="button general">' + dhbgApp.s('verify') + '</button>');
        $verify.on('mouseover', dhbgApp.defaultValues.buttonover);
        $verify.on('mouseout', dhbgApp.defaultValues.buttonout);

        $verify.on('click', function() {
            if (!activity.fullAnswered()){
                $dialog_answer_required.dialog('open');
            }
            else {
                $verify.hide();

                var weight = Math.round(activity.weight());

                if (dhbgApp.scorm) {
                    dhbgApp.scorm.activityAttempt(scorm_id, weight)
                }
                dhbgApp.printProgress();

                var msg, feedback;
                if (weight >= 100) {
                    if (feedbacktrue == null) {
                        feedback = dhbgApp.s('all_correct_percent', weight);
                    }
                    else {
                        feedback = feedbacktrue;
                    }

                    msg = '<div class="correct">' + feedback + '</div>';

                    $this.data('finished', true);
                }
                else {
                    if (feedbackfalse == null) {
                        feedback = dhbgApp.s('wrong_continue', (100 - weight));
                    }
                    else {
                        feedback = feedbackfalse;
                    }

                    msg = '<div class="wrong">' + feedback + '</div>';

                    $this.data('finished', false);
                }
                $box_end.append(msg).show();

                activity.disable();
                activity.highlight('correct', 'wrong');

                if (weight < 100 && allowRetry) {
                    var $button_again = $('<button class="button general">' + dhbgApp.s('continue_activity') + '</button>');
                    $button_again.on('click', function(){
                        $box_end.empty();
                        $box_end.hide();
                        $this.find('.correct').removeClass('correct');
                        $this.find('.wrong').removeClass('wrong');
                        activity.enable();
                        $verify.show();
                    });

                    $box_end.append($button_again);
                }
                $(dhbgApp).trigger('jpit:activity:completed', [$this, {
                    id: scorm_id,
                    weight: weight
                }]);
            }
        });

        $box_verify.append($verify);
        $this.append($box_verify);

        if (mark_type == 'map') {
            var fill_color = $this.attr('data-mark-fill-color') ? $this.attr('data-mark-fill-color') : 'ffffff';
            var stroke_color = $this.attr('data-mark-stroke-color') ? $this.attr('data-mark-stroke-color') : 'ffffff';
            var opacity = $this.attr('data-mark-opacity') ? parseFloat($this.attr('data-mark-opacity')) : 0.4;

            $this.find('img').maphilight( { fill : true, fillColor: fill_color, fillOpacity: opacity, strokeColor: stroke_color } );
        }
    };

    dhbgApp.actions.activityView = function ($this) {
        var scorm_id = $this.attr('data-act-id') ? $this.attr('data-act-id') : 'view';

        if (dhbgApp.scorm) {
            if (!dhbgApp.scorm.activities[scorm_id]) { dhbgApp.scorm.activities[scorm_id] = []; }
        }

        if (dhbgApp.scorm.activities[scorm_id].length > 0) {
            $this.addClass('visited');
            return;
        }

        $this.on('click', function() {
            var weight = 100;

            if (dhbgApp.scorm) {
                dhbgApp.scorm.activityAttempt(scorm_id, weight);
            }

            dhbgApp.printProgress();

            $this.addClass('visited');

            $(dhbgApp).trigger('jpit:activity:completed', [$this, {
                id: scorm_id,
                weight: weight
            }]);
        });

        $(dhbgApp).trigger('jpit:activity:rendered', [$this, { id: scorm_id }]);
    };

    dhbgApp.actions.getFeedbackMsg = function (weight) {
        let msg;
        if (weight >= dhbgApp.evaluation.approve_limit) {
                const text = weight === 100 ? dhbgApp.s("all_correct_percent") : dhbgApp.s("some_correct_percent_approve", weight) 
                msg = `<div class="correct">${text}</div>`;
            }
            else {
                const text = weight === 0 ? dhbgApp.s("wrong_percent") : dhbgApp.s("some_correct_percent_no_approve", weight) 
                msg = `<div class="${weight === 0 ? "wrong" : "partial"}">${text}</div>`;
        }
        
        return msg;
    }

    $('[data-offset="true"]').each(function(){
        var $this = $(this);
        var menu_offset = $this.offset().top + $this.height();

        $( window ).bind("scroll", function() {
            var offset = $(this).scrollTop();

            if (offset >= menu_offset) {
                $this.addClass('scroll_top');
            }
            else if (offset < menu_offset) {
                $this.removeClass('scroll_top');
            }
        });

    });

};

