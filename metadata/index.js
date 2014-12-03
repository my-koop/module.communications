var utils = require("mykoop-utils");
var translations = require("../locales");
var metaDataBuilder = new utils.MetaDataBuilder();
metaDataBuilder.addData("translations", translations);
metaDataBuilder.addData("core", {
    contributions: {
        settings: {
            communications: {
                titleKey: "communications::title",
                component: {
                    resolve: "component",
                    value: "SettingsContribution"
                }
            }
        }
    }
});
var resMetaData = metaDataBuilder.get();
module.exports = resMetaData;
