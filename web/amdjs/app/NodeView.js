define(
    [
        "underscore",
        "backbone",
        "mustache",
        "text!app/node.mustache"
    ],

    function (
        _,
        backbone,
        mustache,
        tmplNode)
    {
        "use strict";

        return backbone.View.extend({
            initialize: function () {
                if (this.model) {
                    this.model.on("change", this.render, this);
                }
            },

            render: function () {
                this.$el.html(
                    mustache.to_html(
                        tmplNode,
                        _.extend(
                            this.model.toJSON(),
                            {
                                isKing: this.model.isKing()
                            }
                        )
                    )
                );

                return this;
            },

            events: {
                "click .remove": function () {
                    this.trigger("removalRequested", this);
                }
            }
        });
    }
);