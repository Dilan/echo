define(["backbone", "app/ClusterView"], function (backbone, ClusterView) {
    "use strict";

    return function () {
        describe("app/ClusterView", function () {
            var model = new backbone.Model({foo: "bar"}),
                view = new ClusterView({model: model});

            it("has traits backbone.View", function () {
                expect(view.$).toBeDefined();
            });
        });

        describe("rendered app/ClusterView", function () {
            var model = new backbone.Model({nodes: new backbone.Collection()}),
                view = new ClusterView({model: model});

            it("displays [add] link", function () {
                expect(view.render().$("a[class='add']").size()).toBe(1);
            });
        });
    };
});