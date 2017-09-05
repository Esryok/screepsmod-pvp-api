const package = require("../package.json");

module.exports = function (config, statsMod) {
    config.engine.on('init', function (processType) {
        if (config.features && processType === "main") {
            config.features.defineFeature("pvp-api", package.name, package.version);
        }
    });
};