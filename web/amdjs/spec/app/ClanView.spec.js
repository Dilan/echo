define(["backbone", "app/ClanView"], function (backbone, ClanView) {
    "use strict";

    return function () {
        describe("app/ClanView", function () {
            var model = new backbone.Model({foo: "bar"}),
                view = new ClanView({model: model});

            it("has traits backbone.View", function () {
                expect(view.$).toBeDefined();
            });
        });

        describe("rendered app/ClanView", function () {
            var model = new backbone.Model({foo: "bar"}),
                view = new ClanView({model: model});

            it("displays [add] link", function () {
                expect(view.render().$("a[class='add']").size()).toBe(1);
            });
        });
    };
});