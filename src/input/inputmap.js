/**
 * Input mapping table.
 */
GE.InputMap = GE.Klass({

    name: "",

    _deviceMap: {},

    initialize: function(name) {
        this.name = name || "";
    },

    add: function(device, name, action) {

        var d = device,
            m = this._deviceMap[d.getUId()];

        if(!m) {
            m = new GE.InputDeviceMap(d);
            this._deviceMap[d.getUId()] = m;
        }

        m.add(name, action);
    },

    isDown: function(name, deviceId) {
        return this.__test(name, "isDown", deviceId);
    },

    isUp: function(name, deviceId) {
        return this.__test(name, "isUp", deviceId);
    },

    isPressed: function(name, deviceId) {
        return this.__test(name, "isPressed", deviceId);
    },

    isReleased: function(name, deviceId) {
        return this.__test(name, "isReleased", deviceId);
    },

    check: function(names, deviceId) {
        var dvs = (typeof deviceId === 'undefined') ? { deviceId: this._deviceMap } : this._deviceMap[deviceId],
            device,
            keys;

        if(typeof names === 'string') {
            names = [names];
        }

        GE.jQuery.each(dvs, function(k, v) {
            var name;

            for(var i = 0; i < names.length; i++) {
                name = names[i];
                keys = v.getKeys(name);

                if(keys) {
                    return false;
                }
            }

            return true;
        });

        return false;
    },

    /**
     *
     * @param name
     * @param fn
     * @param [deviceId]
     */
    __test: function(name, fn, deviceId) {

        var dvs = (typeof deviceId === 'undefined') ? { deviceId: this._deviceMap } : this._deviceMap[deviceId],
            device,
            keys;

        GE.jQuery.each(dvs, function(k, v) {
            keys = v.getKeys(name);
            device = v.getDevice();

            for(var i = 0; i < keys.length; i++) {
                if(device[fn](keys[i]))
                {
                    return true;
                }
            }
        });

        return false;

    }
});