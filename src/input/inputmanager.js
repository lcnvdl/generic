/**
 * Input manager.
 * @type {InputManager}
 * @constructor
 */
GE.InputManager = GE.Klass(GE.EventManager, {

    //  *****************************
    //  Class Definitions
    //  *****************************

    devices: {},

    maps: {
        "default": null
    },


    //  *****************************
    //  Constructor
    //  *****************************

    initialize: function() {
        this.maps["default"] = new GE.InputMap();
    },


    //  *****************************
    //  Public Methods
    //  *****************************

    getMap: function(name) {
        if(typeof name === 'undefined')
            return this.maps["default"];

        return this.maps[name];
    },

    detectDevices: function() {
        var i = 0;
        if(GE.MouseDevice && !this.devices["mouse"]) {
            this.devices["mouse"] = new GE.MouseDevice().start();
            console.log(this.devices["mouse"].getId() + " loaded.");
            ++i;
        }
        if(GE.KeyboardDevice && !this.devices["keyboard"]) {
            this.devices["keyboard"] = new GE.KeyboardDevice().start();
            console.log(this.devices["keyboard"].getId() + " loaded.");
            ++i;
        }

        return i;
    },

    getPlayerDevice: function(playerNum) {
        if(typeof playerNum === 'undefined' || playerNum <= 1) {
            throw "Not implemented."
        }
        else {
            throw "Not implemented."
        }
    }

});
