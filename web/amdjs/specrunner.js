var jasmineRun = function () {
    "use strict";

    var jasmineEnv = jasmine.getEnv(),
        htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.updateInterval = 1000;
    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function (spec) {
        return htmlReporter.specFilter(spec);
    };

    jasmineEnv.execute();
};

require(["underscore"], function (_) {
    "use strict";

    require(
        [
            "spec/app/Router.spec",
            "spec/app/Clan.spec",
            "spec/app/ClanView.spec"
        ],

        function () {
            _.each(arguments, function (arg) {
                arg();
            });

            jasmineRun();
        }
    );
});
