var utils = require("mykoop-utils");
var translations = require("../locales");
var metaDataBuilder = new utils.MetaDataBuilder();
metaDataBuilder.addData("translations", translations);
metaDataBuilder.addData("contributions", {
    core: {
        settings: {
            communications: {
                titleKey: "communications::title",
                component: {
                    resolve: "component",
                    value: "SettingsContribution"
                },
                priority: 200
            }
        }
    }
});
var resMetaData = metaDataBuilder.get();
module.exports = resMetaData;
