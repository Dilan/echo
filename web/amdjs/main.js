require(
    [
        "jquery",
        "backbone",
        "app/Router"
    ],

    function (
        $,
        backbone,
        Router)
    {
        "use strict";

        $(function () {

            var router = new Router({
                window: window
            });

            window.app = {
                router: router
            };
            backbone.history.start({ root: '/' });
        });
    }
);
