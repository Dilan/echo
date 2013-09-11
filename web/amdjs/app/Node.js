define(["underscore", "async", "backbone", "q"],
    function (_, async, backbone, Q) {
        "use strict";

        var now = function () {
                return new Date();
            },
            getRandomInt = function (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };

        return backbone.Model.extend({
            defaults: {
                id: null,
                king: null,
                status: 'running'
            },

            initialize: function (attributes, options) {
                Q.stopUnhandledRejectionTracking();

                this.network = options.network;
                this.cluster = options.cluster;
                this.pingMonitoring = options.pingMonitoring;

                this.on('change:king', this.onKingChanged, this);
                this.on('change:status', this.onStatusChanged, this);

                this.pingMonitoring.on('change:cycleUniqueId', this.stopPreviousPingCycle, this);
                this.pingMonitoring.on('lost', this.theKingIsLost, this);

                this.on('ALIVE?', this.replyFineThanks, this);
                this.on('IMTHEKING', this.registerTheKing, this);
                this.on('PING', this.onPing, this);

                options._.defer(this.findTheKingOnInit, this);
            },

            findTheKingOnInit: function (that) {
                that.findTheKing(that.allNodes());
            },

            findTheKing: function (nodeCollection) {
                var that = this;

                var promises = _.map(
                    nodeCollection.models,
                    function (node) {
                        return function () {
                            return Q.fcall(
                                function () { return that.network.send('ALIVE?', that, node); }
                            );
                        }()
                    },
                    []
                );

                Q.allSettled(promises).then(function (results) {
                    var allMessages = [];
                    results.forEach(function (result) {
                        if (result.state === "fulfilled") {
                            var value = result.value;
                            allMessages.push(value);
                        } else {
                            var reason = result.reason;
                        }
                    });

                    if (-1 == _.indexOf(allMessages, 'FINETHANKS')) {
                        that.registerTheKing(that);
                    }
                });
            },

            registerTheKing: function (king) {
                if (this.get('status') == 'running') {
                    this.set('king', king);
                }
            },

            onPing: function (callback) {
                if (this.get('status') == 'running') {
                    callback(null, now());
                } else {
                    callback('stopped');
                }
            },

            replyFineThanks: function (callback, node) {
                if (this.get('status') == 'running') {
                    callback(null, 'FINETHANKS');

                    var that = this;
                    setTimeout(function () {
                        if (that == that.get("king")) {
                            node.trigger('IMTHEKING', that);
                        } else if (null == that.get("king")) {
                            that.findTheKing(that.superiorNodes());
                        }
                    }, 500);
                } else {
                    callback('stopped');
                }
            },

            isKing: function () {
                return this == this.get("king");
            },

            isStopped: function () {
                return 'stopped' == this.get("status");
            },

            isNotStopped: function () {
                return !this.isStopped();
            },

            onKingChanged: function () {
                if (null == this.get("king") && this.isNotStopped()) {
                    this.findTheKing(this.superiorNodes());
                }
                else if (null == this.get("king") && this.isStopped()) {
                    this.stopCurrentPingCycle();
                }
                else if (this != this.get("king") && this.isNotStopped()) {
                    this.startPingTheKingPeriodically(this.get("king"));
                }
                else if (this == this.get("king")) {
                    this.stopCurrentPingCycle();
                    this.proclaimTheKing(this.get("king"), this.allNodes());
                }
            },

            proclaimTheKing: function (king, nodeCollection) {
                _.each(
                    nodeCollection.models,
                    function (node) {
                        node.trigger('IMTHEKING', king);
                    }
                );
            },

            startPingTheKingPeriodically: function (king) {
                var that = this,
                    cycleTimeInMilliseconds = 1000;

                this.startPingCycle(
                    setInterval(
                        function () {
                            that.ping(king);
                        },
                        cycleTimeInMilliseconds // period
                    ),
                    cycleTimeInMilliseconds
                );
            },

            ping: function (king) {
                var that = this;

                this.network.send('PING', this, king)
                    .then(function (response) {
                        that.pingMonitoring.saveSuccessTime(now());
                    }, function (error) {
                        that.pingMonitoring.saveFailTime(now());
                    });
            },

            theKingIsLost: function () {
                this.set("king", null);
            },

            allNodes: function () {
                return this.cluster.nodes(this);
            },

            superiorNodes: function () {
                return this.cluster.superiorNodes(this);
            },

            startPingCycle: function (cycleUniqueId, cycleTimeInMilliseconds) {
                this.pingMonitoring.set("cycleUniqueId", cycleUniqueId);
                this.pingMonitoring.startMonitoring(2 * cycleTimeInMilliseconds);
            },

            stopPreviousPingCycle: function () {
                this.stopPingCycle(
                    this.pingMonitoring.previous("cycleUniqueId")
                );
            },

            stopCurrentPingCycle: function () {
                this.stopPingCycle(
                    this.pingMonitoring.get("cycleUniqueId")
                );
            },

            stopPingCycle: function (cycleUniqueId) {
                if (null != cycleUniqueId) {
                    this.pingMonitoring.stopMonitoring();
                    clearInterval(cycleUniqueId);
                }
            },

            onStatusChanged: function () {
                if (this.isStopped()) {
                    this.set('king', null);
                } else {
                    this.findTheKing(this.allNodes());
                }
            },

            stopRequested: function () {
                this.set('status', 'stopped');
            },

            startRequested: function () {
                this.set('status', 'running');
            }
        });
    });