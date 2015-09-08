;
(function ($) {
    "use strict";

    var scrollSpy = function () {

        var lastId,
            topMenu = $("#main_nav"),
            topMenuHeight = topMenu.outerHeight() + 30,
            menuItems = topMenu.find("a"),
            scrollItems = menuItems.map(function () {
                var item = $($(this).attr("href"));
                if (item.length) {
                    return item;
                }
            });

        menuItems.click(function (e) {
            var href = $(this).attr("href"),
                offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight + 1;
            $('html, body').stop().animate({
                scrollTop: offsetTop
            }, 300);
            e.preventDefault();
        });

        $(window).scroll(function () {
            var fromTop = $(this).scrollTop() + topMenuHeight;

            var cur = scrollItems.map(function () {
                if ($(this).offset().top < fromTop)
                    return this;
            });
            cur = cur[cur.length - 1];
            var id = cur && cur.length ? cur[0].id : "";

            if (lastId !== id) {
                lastId = id;
                menuItems
                    .parent().removeClass("active")
                    .end().filter("[href=#" + id + "]").parent().addClass("active");
            }
        });

    };

    var videoOpen = function () {
        var videoBlock = $('.video');
        videoBlock.click(function(e){
            e.preventDefault();
            videoBlock.addClass('active');
        });
    };

    var popups = function () {
        var popupBack = $('.popup-back'),
            popup = $('.popup'),
            close = popup.find('.close'),
            recallBtn = $('.recall-button'),
            bidBtn = $('.bid-button'),
            recallPopup = $('.recall-popup'),
            bidPopup = $('.bid-popup'),
            bidTheme = bidPopup.find('.bid-theme');

        popupBack.click(function(e){
            e.preventDefault();
            popupBack.fadeOut();
            popup.fadeOut();
            bidTheme.val('');
        });
        close.click(function(e){
            e.preventDefault();
            popupBack.fadeOut();
            popup.fadeOut();
            bidTheme.val('');
        });

        recallBtn.click(function(e){
            e.preventDefault();
            popupBack.fadeIn();
            recallPopup.fadeIn();
        });

        bidBtn.click(function(e){
            e.preventDefault();
            popupBack.fadeIn();
            bidPopup.fadeIn();

            bidTheme.val($(this).data('theme'));

        });

    };

    var mailSending = function () {

        var mailTo = 'leads@outsale.org';

        $('#recall_popup').ajaxMailSend({
            mail_to: mailTo,
            show_message_block: true,
            email_title: 'Заказ звонка'
        });

        $('#bid_popup').ajaxMailSend({
            mail_to: mailTo,
            show_message_block: true,
            email_title: 'Заявка'
        });

        $('#main_form').ajaxMailSend({
            mail_to: mailTo,
            show_message_block: false,
            email_title: 'Заявка'
        });

        $('#footer_form').ajaxMailSend({
            mail_to: mailTo,
            show_message_block: false,
            email_title: 'Заявка'
        });

        $('form input[type="text"]').each(function(){
            $(this).keyup(function(){
                if ($(this).val().length >= 5) {
                    yaCounter30783208.reachGoal('form');
                    ga('send', 'event', 'outsale', 'form');
                }
            });
        });

    };

    $(document).ready(function () {
        scrollSpy();
        videoOpen();
        popups();
        mailSending();

    });

})(jQuery);