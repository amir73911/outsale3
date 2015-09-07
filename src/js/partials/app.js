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

        console.log(topMenuHeight)

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

    $(document).ready(function () {
        scrollSpy();
        videoOpen();
    });

})(jQuery);