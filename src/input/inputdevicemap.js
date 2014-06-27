/**
 * Input device mapping table.
 * ONLY Internal use.
 */
GE.InputDeviceMap = GE.Klass({

    _map: {},

    _device: null,

    initialize: function(device) {
        this._device = device;
    },

    add: function(name, action) {

        var m = this._map;
        if(!m[name]) {
            m[name] = [];
        }

        m[name].push(action);
    },

    getKeys: function(name) {
        return this._map[name];
    },

    getDevice: function() {
        return this._device;
    }

});

