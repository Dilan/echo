define(["underscore", "backbone", "app/Node"],
    function (_, backbone, Node) {
        "use strict";

        return backbone.Collection.extend({
            model: Node
        });
    }
);