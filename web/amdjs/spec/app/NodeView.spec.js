define(["backbone", "app/NodeView"], function (backbone, NodeView) {
    "use strict";

    return function () {
        describe("app/NodeView", function () {
            var model = new backbone.Model({foo: "bar"}),
                view = new NodeView({model: model});

            it("has traits backbone.View", function () {
                expect(view.$).toBeDefined();
            });
        });

        describe("rendered app/NodeView", function () {
            var model = new backbone.Model({foo: "bar"});
            model.isKing = function() { return true; };

            var view = new NodeView({model: model});

            it("displays [node] element", function () {
                expect(view.render().$("div[class='node']").size()).toBe(1);
            });
        });
    };
});