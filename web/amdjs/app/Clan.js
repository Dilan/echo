define(["backbone", "app/Node"], function (backbone, Node) {
    "use strict";

    return backbone.Model.extend({
        defaults: {
            nodes: [],
            king: null
        },

        addNode: function () {
            var nodes = this.get('nodes'),
                that = this;

            nodes.push(
                new Node(
                    { id:this.generateId(),
                      clan: this
                    },
                    { window:window }
                )
            );
            this.set("nodes", nodes);
            this.trigger("addNode");
        },

        isKing: function(node) {
            return this.get("king") != null && this.get("king").get("id") == node.get("id");
        },

        generateId: function() {
            return this.get("nodes").length + 1;
        }
    });
});