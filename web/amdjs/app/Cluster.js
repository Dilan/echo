define(
    ["underscore", "backbone", "app/Node", "app/NodeCollection", "app/Network", "app/PingMonitoring"],
    function (_, backbone, Node, NodeCollection, Network, PingMonitoring) {
    "use strict";

    var lastNodeId = 0;

    return backbone.Model.extend({
        defaults: {
            nodes: new NodeCollection(),
            king: null
        },

        initialize : function(attributes) {
            this.get('nodes').on('add', this.onAddNode, this);
        },

        addNode: function () {
            this.get("nodes").add(this.newNode());
        },

        newNode: function() {
            return new Node(
                {
                    id: this.generateId()
                },
                {
                    cluster: this,
                    network: new Network(),
                    pingMonitoring: new PingMonitoring({timeOutInMilliseconds:4000})
                }
            );
        },

        onAddNode: function(node) {
            this.trigger("addNode", this);
        },

        nodes: function(excludeNode) {
            return _.reduce(
                this.get("nodes").models,
                function(result, node) {
                    if(node != excludeNode) {
                        result.push(node);
                    }
                    return result;
                },
                new NodeCollection()
            );
        },

        superiorNodes: function(currentNode) {
            return _.reduce(
                this.nodes().models,
                function(result, node) {
                    if (node.get("id") > currentNode.get("id")) {
                        result.add(node);
                    }
                    return result;
                },
                new NodeCollection()
            );
        },

        generateId: function() {
            return ++lastNodeId;
        }
    });
});