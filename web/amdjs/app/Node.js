define(["backbone", "app/Message"], function (backbone, Message) {
    "use strict";

    return backbone.Model.extend({

        defaults: {
            id: "",
            clan: null
        },

        isKing: function() {
            return this.get('clan').isKing(this);
        },


        initialize : function(attributes, options) {
            this.window = options.window;

            this.pingKing();
        },

        pingKing: function() {
            this.window.setTimeout(function () {
                console.log("PING");
            }, 1000);
        }

    });
});