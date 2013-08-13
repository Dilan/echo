define(
    [
        "jquery",
        "backbone",
        "app/ClanView",
        "app/Clan"
    ],

    function ($, backbone, ClanView, Clan) {
        "use strict";

        return backbone.Router.extend({
            initialize: function (options) {
                this.Clan = new Clan();
            },

            routes: {
                "": "index"
            },

            index: function () {
                var view = new ClanView({
                        model: this.Clan,
                        navigator: this
                    }),
                    el = $("#root-container");

                el.html(view.render().el);

            }
        });
    }
);
