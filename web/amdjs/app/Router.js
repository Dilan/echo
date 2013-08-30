define(
    [
        "jquery",
        "backbone",
        "app/ClusterView",
        "app/Cluster"
    ],

    function ($, backbone, ClusterView, Cluster) {
        "use strict";

        return backbone.Router.extend({
            initialize: function (options) {
                this.Cluster = new Cluster();
            },

            routes: {
                "": "index"
            },

            index: function () {
                var view = new ClusterView({
                        model: this.Cluster,
                        navigator: this
                    }),
                    el = $("#root-container");

                el.html(view.render().el);

            }
        });
    }
);
