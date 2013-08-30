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
                "click .stop": function () {
                    this.model.off('PING');
                    this.model.off('ALIVE?');

                    this.model.on('PING', this.model.offPing, this.model);
                    this.model.on('ALIVE?', this.model.aliveLost, this.model);

                    console.log("PING switched OFF ["+ this.model.get("id") +"]");

                },
                "click .recover": function () {
                    this.model.off('PING');
                    this.model.off('ALIVE?');

                    this.model.on('PING', this.model.onPing, this.model);
                    this.model.on('ALIVE?', this.model.onAlive, this.model);

                    console.log("PING switched ON ["+ this.model.get("id") +"]");
                }
            }
        });
    }
);