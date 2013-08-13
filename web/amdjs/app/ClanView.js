define(
    [
        "underscore",
        "backbone",
        "mustache",
        "text!app/clan.mustache",
        "app/NodeView"
    ],

    function (
        _,
        backbone,
        mustache,
        tmplClan,
        NodeView)
    {
        "use strict";

        return backbone.View.extend({
            initialize: function () {
                this.model.on("addNode", this.populate, this);
                this.nodeIdToViewMap = [];
            },

            render: function () {
                this.$el.html(mustache.to_html(tmplClan, this.model.toJSON()));
                this.populate();
                return this;
            },

            events: {
                "click .add": function () {
                    this.model.addNode();
                }
            },

            populate: function() {
                if (this.model.get("nodes") != undefined && this.model.get("nodes").length > 0) {
                    _.each(this.model.get("nodes"), function (node) {
                        if(this.nodeIdToViewMap[node.get('id')] == undefined) {
                            var view = new NodeView({model: node});

                            this.nodeIdToViewMap[node.get('id')] = view;
                            this.$el.find(".nodes").append(view.render().el);
                        }
                    }, this);
                }
            }
        });
    }
);
