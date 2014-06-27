GE.DeviceStatus = {
    NONE: 0,
    PLUGGED: 1,
    CONNECTED: 1,
    UNPLUGGED: 2,
    DISCONNECTED: 2
};

GE.DeviceAxis = GE.Klass({

    value: {dx: 0, dy: 0},
    deadZone: 0.001,

    initialize: function() {

    },

    set: function(dx, dy) {
        if(this.deadZone != 0) {
            //  TODO
            /*if(dx <= this.deadZone) {
                dx = 0;
            }
            if(dy <= this.deadZone) {
                dy = 0;
            }
            if(dx >= 1-this.deadZone) {
                dx = 1;
            }
            if(dy >= 1-this.deadZone) {
                dy = 1;
            } */

        }

        this.value.dx = dx;
        this.value.dy = dy;
    },

    clear: function() {
        this.set(0, 0);
    },

    get: function(){
        return this.value;
    },

    getX: function(){
        return this.value.dx;
    },

    getY: function(){
        return this.value.dy;
    },

    /**
     * TODO
     * @returns {boolean}
     */
    haveButton: function() {
        return false;
    }
});

/**
 * Abstract input device.
 * @type {InputDevice}
 * @constructor
 */
GE.InputDevice = GE.Abstract(GE.EventManager, {

    $name: "InputDevice",

    $statics: {
        inputDeviceId: 0
    },

    $abstracts: {
        isPressed: function(key) {},
        isReleased: function(key) {},
        isUp: function(key) {},
        isDown: function(key) {}
    },

    __id: 0,

    _status: 0,

    __axis: [],

    initialize: function() {
        this.__id = ++GE.InputDevice.$static.inputDeviceId;
        this._status = GE.DeviceStatus.NONE;
    },

    start: function() {
        return this;
    },

    stop: function() {
        return this;
    },

    dispose: function() {
        this.stop();
    },

    countAxis: function() {
        return this.__axis.length;
    },

    getAxis: function(axis) {
        if(typeof axis === 'undefined')
            axis = 0;

        return this.__axis[axis];
    },

    getStatus: function() {
        return this._status;
    },

    _addAxis: function() {
        this.__axis.push(new GE.DeviceAxis());
    },

    getId: function() {
        return "$device("+this.$name+"_"+this.__id+")";
    },

    getUId: function() {
        return "$device("+this.$name+"_"+this.__id+")";
    }

});
