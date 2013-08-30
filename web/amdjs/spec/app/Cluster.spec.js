define(["backbone", "app/Cluster"], function (backbone, Cluster) {
    "use strict";

    return function () {
        describe("app/Cluster", function () {
            it("has traits of backbone.Model", function () {
                expect(_.isFunction(new Cluster().toJSON)).toBe(true);
            });
            it("has 1 default property", function () {
                expect(_.keys(new Cluster().defaults)).toEqual(["nodes", "king"]);
            });
        });
        describe("app/Cluster.addNode()", function () {
            /*
            it("add object Node to [nodes] property", function () {
                var model = new Cluster();
                model.addNode();

                expect(model.get("nodes").length).toBe(1);
            });*/
/*
            it("triggers addNode event", function () {
                var model = new Cluster();

                spyOn(model, "trigger");
                model.addNode();
                expect(model.trigger).toHaveBeenCalledWith("addNode");
            });
*/
        });
    };
});