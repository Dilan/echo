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
            var model = new backbone.Model(),
                view = new NodeView({model: model});

            it("displays button to stop", function () {
                expect(view.render().$("a[class='stop btn btn-primary']").size()).toBe(1);
            });

            it("displays button to recover", function () {
                expect(view.render().$("a[class='recover btn btn-primary']").size()).toBe(1);
            });
        });
    };
});