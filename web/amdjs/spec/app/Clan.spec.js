define(["backbone", "app/Clan"], function (backbone, Clan) {
    "use strict";

    return function () {
        describe("app/Clan", function () {
            it("has traits of backbone.Model", function () {
                expect(_.isFunction(new Clan().toJSON)).toBe(true);
            });
            it("has 1 default property", function () {
                expect(_.keys(new Clan().defaults)).toEqual(["nodes"]);
            });
        });
        describe("app/Clan.addNode()", function () {
            it("add object Node to [nodes] property", function () {
                var model = new Clan();
                model.addNode();

                expect(model.get("nodes").length).toBe(1);
            });

            it("triggers addNode event", function () {
                var model = new Clan();

                spyOn(model, "trigger");
                model.addNode();
                expect(model.trigger).toHaveBeenCalledWith("addNode");
            });

        });
    };
});