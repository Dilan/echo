define(["backbone"], function (backbone) {
    "use strict";

    return backbone.Model.extend(
    {
        initialize : function(attributes) {
            this.window = attributes.window;
        },

        send: function(message, from,  to, callback) {
            /*
            var that = this,
                timeOutId = this.window.setTimeout(
                function() {
                    console.log("Timeout take place in Node [" + to.get("id") + "]");
                    callback(true); // timeout error
                },
                2000
            );*/

            var that = this;

            console.log('send(' + message + ') from Node [' +
                from.get('id') + '], to Node [' + to.get('id') +']');

            to.trigger(message,
                function(err, response) {
                    if(err) {
                        console.log('ERROR - from Node [' +
                            from.get('id') + '] to Node [' + to.get('id') +']');
                        callback(err);
                    } else {
                        console.log('RESPONSE - from Node [' +
                            to.get('id') + '] at Node [' + from.get('id') +']');
                        callback(null, response);
                    }
                },
                from
            );
/*
            this.window.setTimeout(function() {
                console.log("Send  [" + message + "] from [" + from.get("id") + "] to [" + to.get("id") + "]");

                to.trigger(message,
                    function() {

                    }
                );
            }, 0);
*/
        }
    }, {
        delay: 1000
    });
});