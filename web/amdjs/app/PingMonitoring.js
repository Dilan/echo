define(
    ["underscore", "backbone"],
    function (_, backbone) {
        "use strict";

        var now = function() {
            return new Date();
        };

        return backbone.Model.extend({
            defaults: {
                lastSuccessTime: null,
                lastFailTime: null,
                cycleUniqueId: null
            },

            initialize : function(attributes) {
                this.monitoringCycleUniqueId = null;
                this.timeOutInMilliseconds = attributes.timeOutInMilliseconds;
            },

            stopMonitoring: function() {
                if(null != this.monitoringCycleUniqueId) {
                    clearInterval(this.monitoringCycleUniqueId);
                }
            },

            startMonitoring: function() {
                var that = this;
                this.monitoringCycleUniqueId = setInterval(
                    function () {
                        that.monitoring();
                    },
                    this.timeOutInMilliseconds
                );
            },

            monitoring: function() {
                if (null == this.get("lastSuccessTime") ||
                   (now().getTime() - this.get("lastSuccessTime").getTime()) >= this.timeOutInMilliseconds )
                {
                    this.trigger('lost', this);
                }
            },

            saveSuccessTime: function(time) {
                this.set("lastSuccessTime", time);
            },

            saveFailTime: function(time) {
                this.set("lastFailTime", time);
            }
        });
    });