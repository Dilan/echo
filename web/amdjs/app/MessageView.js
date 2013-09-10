define(
    [
        "underscore",
        "backbone",
        "mustache",
        "text!app/message.mustache"
    ],

    function (
        _,
        backbone,
        mustache,
        tmplMessage)
    {
        "use strict";

        return backbone.View.extend({
            initialize: function (options) {

            },

            render: function () {
                this.$el.html(mustache.to_html(tmplMessage, { text: this.options.text }));
                return this;
            }
        });
    }
);
