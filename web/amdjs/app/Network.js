define(["backbone", "q"], function (backbone, Q) {
    "use strict";

    return backbone.Model.extend(
    {
        initialize : function(attributes) {
            this.msTimeout = 4000;
            Q.stopUnhandledRejectionTracking();
        },

        sendPromise: function(message, from,  to) {
            var deferred = Q.defer();

            to.trigger(message,
                function(err, response) {
                    if (err) {
                        deferred.reject(new Error(err));
                    } else {
                        deferred.resolve(response);
                    }
                },
                from
            );

            return deferred.promise;
        },

        send: function(message, from,  to) {
            return this.sendPromise(message, from,  to).timeout(this.msTimeout);
        }
    });
});