define(["underscore", "backbone", "app/Node"], function (_, backbone, Node) {
    "use strict";

    return function () {
        describe("app/Node", function () {
            var node = new Node(
                { id: 1001 },
                {
                    _: { defer: function() { } },
                    pingMonitoring: new backbone.Model()
                }
            );

            it("has traits of backbone.Model", function () {
                expect(_.isFunction(node.toJSON)).toBe(true);
            });
            it("has default properties", function () {
                expect(_.keys(node.defaults)).toEqual(["id", "king", "status"]);
            });
        });

        describe("app/Node method [proclaimTheKing]", function () {
            var node1 =new backbone.Model(),
                node2 =new backbone.Model(),
                node3 =new backbone.Model(),

                nodeCollection = new backbone.Collection([node1,node2,node3]),
                king = new Node(
                    { id: 1001 },
                    {
                        _: { defer: function() { } },
                        pingMonitoring: new backbone.Model()
                    }
                );

            it("send IMTHEKING to 1st Node", function () {
                spyOn(node1, "trigger");
                king.proclaimTheKing(king, nodeCollection);
                expect(node1.trigger.argsForCall[0]).toEqual(["IMTHEKING", king]);
            });
            it("send IMTHEKING to 2nd Node", function () {
                spyOn(node2, "trigger");
                king.proclaimTheKing(king, nodeCollection);
                expect(node2.trigger.argsForCall[0]).toEqual(["IMTHEKING", king]);
            });
            it("send IMTHEKING to 3rd Node", function () {
                spyOn(node3, "trigger");
                king.proclaimTheKing(king, nodeCollection);
                expect(node3.trigger.argsForCall[0]).toEqual(["IMTHEKING", king]);
            });
        });

        describe("app/Node callback on PING", function () {
            var node = new Node(
                    { id: 1001 },
                    {
                        _: { defer: function() { } },
                        pingMonitoring: new backbone.Model()
                    }
                ),
                king = new Node(
                    { id: 2002 },
                    {
                        _: { defer: function() { } },
                        pingMonitoring: new backbone.Model()
                    }
                );

            it("supply 1st argument = NULL and 2nd = NOW() when Node is running", function () {



                spyOn(node1, "trigger");
                node.trigger()proclaimTheKing(king, nodeCollection);
                expect(node1.trigger.argsForCall[0]).toEqual(["IMTHEKING", king]);
            });
        });
    };
});