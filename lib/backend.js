const _ = require('lodash');
const express = require('express');

module.exports = function (config, statsMod) {
    var storage = config.common.storage;

    config.backend.on('expressPreConfig', function (app) {

        // /api/experimental/pvp
        // /api/experimental/nukes
        app.use('/api/experimental', serveExperimental());
    });
    
    function serveExperimental() {
        var router = new express.Router();
        
        router.get('/pvp', (req, res) => {
            var start = req.query.start;
            storage.env.get(storage.env.keys.GAMETIME)
            .then((data) => {
                var time = data;
                storage.db.rooms.find({ lastPvpTime: { $gte: start || time } }).then((fightclub) => {
                    var rooms = _.pluck(fightclub, ['_id', 'lastPvpTime']);
                    res.send({ ok :1, time, rooms })
                });
            });
        });

        router.get('/nukes', (req, res) => {
            storage.db['rooms.objects'].find({ type: "nuke" }).then((nukes) => {
                res.send({
                    ok: 1,
                    nukes: _.pluck(nukes, [ '_id', 'type', 'room', 'x', 'y', 'landTime', 'launchRoomName' ])
                })
            });
        });

        return router;
    }
}