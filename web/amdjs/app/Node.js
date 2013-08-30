define(["underscore", "async", "backbone"],
    function (_, async, backbone) {
    "use strict";

    return backbone.Model.extend({
        defaults: {
            id: null,
            king: null
        },

        initialize : function(attributes, options) {
            this.network = options.network;
            this.window = options.window;
            this.cluster = options.cluster;

            // listeners
            this.on('change:king', this.onKingChanged, this);

            this.on('PING', this.onPing, this);
            this.on('IMTHEKING', this.registerKing, this);
            this.on('ALIVE?', this.onAlive, this);

            _.defer(this.findTheKingOnInit, this);
        },

        findTheKingOnInit: function(that) {
            that.findTheKing(that.allNodes());
        },

        onPing: function(callback) {
            console.log("Ping received in NODE [" + this.get("id") + "]");
            callback(null, new Date());
        },

        onAlive: function(callback, node) {
            console.log("onAlive in NODE [" + this.get("id") + "] from Node [" + node.get("id") + "]");
            callback(null, 'FINETHANKS');

            if(this == this.get("king")) {
                node.trigger('IMTHEKING', this);
            } else {
                if(null == this.get("king")) {
                    this.findTheKing(this.superiorNodes());
                }
            }
        },

        offPing: function(callback) {
            console.log("Ping OFF in NODE [" + this.get("id") + "]");
            callback(true);
        },

        aliveLost: function(callback, node) {
            console.log("alive LOST in NODE [" + this.get("id") + "] from Node [" + node.get("id") + "]");
            callback(true);
        },

        findTheKing: function(nodes) {
            var that = this;

            async.map(nodes.models,
                function(node, callback){

                    node.trigger('ALIVE?',
                        function(err, response) {
                            var date = new Date();
                            console.log('RESPONSE ('+response+') at [' + date.toString('h:mm:ss')  + '] - from Node [' +
                                    node.get('id') + '] at Node [' + that.get('id') +']');
                            callback(null, response);

                        },
                        that
                    );
                },
                function(error, results) {
                    console.log('result length is [' +  results.length + '] in NODE [' + that.get("id") +']')

                    if(-1 == _.indexOf(results, 'FINETHANKS')) {
                        console.log('no any fine-thanks was received in NODE [' + that.get("id") + ']');
                        that.proclaimedToBeTheKing();
                    } else {
                        console.log('at least ONE fine-thanks was received in NODE [' + that.get("id") + '], wait who is the KING');
                    }
                }
            );
        },

        isKing: function() {
            return this == this.get("king");
        },

        onKingChanged: function() {
            if(null == this.get("king")) {
                this.findTheKing(this.superiorNodes());
            }
            else if(this != this.get("king")) {

                console.log("onKingChanged : in Node [" +
                    this.get("id") + "] king now is [" + this.get("king").get("id") +"]");

                this.window.clearInterval(this.pingIntervalId);
                this.startPingTheKingPeriodically();
            }
            else if(this == this.get("king")) {
                this.window.clearInterval(this.pingIntervalId);
                var that= this;

                _.each(
                    this.allNodes().models,
                    function(node) {
                        that.window.setTimeout(
                            function() {
                                node.trigger('IMTHEKING', that);
                            },
                            0
                        );
                    }
                );

            }
        },

        startPingTheKingPeriodically: function() {

            console.log("startPingTheKingPeriodically : in Node [" +
                this.get("id") + "]");

            var that = this;
            this.pingIntervalId = this.window.setInterval(
                function() { that.pingTheKing(); },
                5000
            );
        },

        pingTheKing: function() {
            var that = this,
                sendTime = new Date();

            this.window.setTimeout(function() {
                if(that.get('king') == null) {
                    console.log("Node [" + that.get("id") + "] has no king ... and cant ping");
                } else {

                    that.network.send(
                        'PING',
                        that,
                        that.get('king'),
                        function(err, receiveTime) {
                            if(err) return that.pingLost(sendTime);
                            return that.pingReceived(sendTime);
                        }
                    );

                }
            }, 0);
        },

        getRandomInt: function () {
            var min = 1,
                max = 5;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        pingReceived: function(sendTime) {
            //console.log("pingReceived");
            this.lastReceivedPingTime = sendTime;

        },

        pingLost: function(sendTime) {
            if(sendTime < this.lastReceivedPingTime) {
                console.log("Warning : pingLost but looks ok ");
            } else {
                console.log("Error : pingLost and we have to start looking for new king ....");
                this.set("king", null);
            }

        },

        allNodes: function() {
            return this.cluster.nodes(this);
        },

        superiorNodes: function() {
            return this.cluster.superiorNodes(this);
        },

        proclaimedToBeTheKing: function() {
            this.registerKing(this);
        },

        registerKing: function(king) {
            this.set('king', king);

            if(this == king) {
                var that = this;
                _.each(
                    this.allNodes().models,
                    function(node) {
                        console.log('Node [' + that.get("id") + '] become KING AND inform other NODE [' + node.get("id") + ']')
                        node.trigger('IMTHEKING', king);
                    }
                );
            }
        }
    });
});