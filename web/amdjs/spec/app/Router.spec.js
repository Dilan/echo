define(["underscore", "backbone", "app/Router"], function (_, backbone, Router) {
    "use strict";

    return function () {
        describe("app/Router", function () {
            it("has the traits of backbone.Router", function () {
                expect(new Router({}).navigate).toBeDefined();
            });

            it("defines routes", function () {
                expect(new Router({}).routes[""]).toBeDefined();
            });
        });
    };
});