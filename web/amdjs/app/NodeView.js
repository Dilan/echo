define(
    [
        "underscore",
        "backbone",
        "mustache",
        "text!app/node.mustache",
        "app/MessageView"
    ],

    function (_, backbone, mustache, tmplNode, MessageView) {
        "use strict";

        return backbone.View.extend({

            className: "node panel panel-default",

            initialize: function () {
                if (this.model) {
                    this.model.on("change:king", this.onKingChanged, this);
                    this.model.on("change:status", this.onStatusChanged, this);

                    this.model.on("PING", this.displayIncomeMessagePING, this);
                    this.model.on("ALIVE?", this.displayIncomeMessageALIVE, this);
                    this.model.on("IMTHEKING", this.displayIncomeMessageIMTHEKING, this);
                }
            },

            render: function () {
                this.$el.html(mustache.to_html(tmplNode, this.model.toJSON()));
                return this;
            },

            onKingChanged: function () {
                if(this.model.isKing()) {
                    this.$el.addClass('king panel-primary');
                    this.$el.find(".panel-heading").prepend('<span class="glyphicon glyphicon-tower"></span>');
                } else {
                    this.$el.removeClass('king panel-primary');
                    this.$el.find(".glyphicon").remove();
                }
            },

            onStatusChanged: function () {
                if (this.model.isStopped()) {
                    this.$el.addClass("panel-danger");
                } else {
                    this.$el.removeClass("panel-danger");
                }
            },

            displayIncomeMessagePING: function () {
                this.displayIncomeMessage("PING");
            },

            displayIncomeMessageALIVE: function () {
                this.displayIncomeMessage("ALIVE?")
            },

            displayIncomeMessageIMTHEKING: function () {
                this.displayIncomeMessage("IMTHEKING")
            },

            displayIncomeMessage: function (message) {
                var view = new MessageView({ text: message });
                this.$(".income-messages").append(view.render().el);
                view.$el.fadeOut(2000);
            },

            events: {
                "click .stop": function () {
                    this.model.stopRequested();
                },
                "click .recover": function () {
                    this.model.startRequested();
                }
            }
        });
    }
);