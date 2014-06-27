/**
 * Mouse Buttons.
 * @type {{NONE: number, LEFT: number, MIDDLE: number, RIGHT: number}}
 */
GE.MB = {
    NONE: 0,
    LEFT: 1,
    MIDDLE: 2,
    RIGHT: 3
};
GE.MouseButton = GE.MB;

/**
 * Mouse Button's Status.
 * @type {{UP: number, PRESSED: number, DOWN: number, RELEASED: number}}
 */
GE.MA = {
    UP: 0,
    PRESSED: 1,
    DOWN: 2,
    RELEASED: 3
};

GE.MouseAction = GE.MA;

/**
 *
 * @type {MouseDevices}
 */
GE.MouseDevice = GE.Klass(GE.InputDevice, {

    //  *****************************
    //  Class definitions
    //  *****************************

    $name: "MouseDevice",

    //  *****************************
    //  Attributes
    //  *****************************

    _oldX: 0,
    _oldY: 0,

    x: 0,
    y: 0,

    __timeoutAxis: null,

    __buttonStatus: null,

    //  *****************************
    //  Ctor
    //  *****************************

    initialize: function() {
        this.$super();

        GE.engine.mouse = this;

        this._status = GE.DeviceStatus.CONNECTED;
        this.__buttonStatus = [GE.MA.UP, GE.MA.UP, GE.MA.UP];
        this.__attachEvents();
    },

    //  *****************************
    //  Overrides
    //  *****************************

    start: function() {
        this.$super();

        this._addAxis();

        GE.engine.on(this.getId(), this, GE.Events.Engine.POSUPDATE, function() {

            for (var i = 0; i < this.__buttonStatus.length; i++) {
                switch (this.__buttonStatus[i]) {
                    case GE.MA.PRESSED:
                    {
                        this.__buttonStatus[i] = GE.MA.DOWN;
                    } break;
                    case GE.MA.RELEASED:
                    {
                        this.__buttonStatus[i] = GE.MA.UP;
                    } break;
                }
            }

        }.$member().bind(this));

        return this;
    },

    stop: function() {
        this.$super();
        return this;
    },

    clearAxis: function() {
        this.getAxis(0).clear();
        this.__timeoutAxis = null;
    },

    //  *****************************
    //  Public methods
    //  *****************************

    getPosition: function() {
        return {x: this.x, y: this.y};
    },

    isLeftDown: function() {
        return this.isDown(GE.MB.LEFT);
    },

    isRightDown: function() {
        return this.isDown(GE.MB.RIGHT);
    },

    isPressed: function (key) {
        return this.__buttonStatus[key] == GE.MA.PRESSED;
    },

    isReleased: function (key) {
        return this.__buttonStatus[key] == GE.MA.RELEASED;
    },

    isDown: function (key) {
        return this.__buttonStatus[key] == GE.MA.DOWN;
    },

    isUp: function (key) {
        return this.__buttonStatus[key] == GE.MA.UP;
    },

    //  *****************************
    //  Private methods
    //  *****************************

    __onMouseDown: function (e) {
        var button = this.__getButton(e);
        var value =this.__buttonStatus[button];
        if (value == GE.MA.UP || value == GE.MA.RELEASED) {
            value = GE.MA.PRESSED;
            this.__buttonStatus[button] = value;
        }
    },

    __onMouseUp: function (e) {
        var button = this.__getButton(e);
        var value = this.__buttonStatus[button];
        if (value == GE.MA.DOWN || value == GE.MA.PRESSED) {
            value = GE.MA.RELEASED;
            this.__buttonStatus[button] = value;
        }
    },

    __onMouseMove: function (e) {
        e.preventDefault();

        this._oldX = this.x;
        this._oldY = this.y;

        // The following will translate the mouse coordinates into a number
        // ranging from -1 to 1, where
        //      x == -1 && y == -1 means top-left, and
        //      x ==  1 && y ==  1 means bottom right
        this.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        this.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

        var $this = this;
        if(this.__timeoutAxis) {
            clearTimeout(this.__timeoutAxis);

            var dx = Math.sign(this.x - this._oldX),
                dy = Math.sign(this.y - this._oldY);

            this.getAxis(0).set(dx, dy);
        }

        this.__timeoutAxis = setTimeout(function(){$this.clearAxis();}, 30);
    },

    __attachEvents: function () {

        document.addEventListener('mousemove', function(e){
            GE.engine.mouse.__onMouseMove(e);}.$member(), false);
        document.addEventListener('mousedown', function(e){
            GE.engine.mouse.__onMouseDown(e);}.$member(), false);
        document.addEventListener('mouseup', function(e){
            GE.engine.mouse.__onMouseUp(e);}.$member(), false);

    },

    __getButton: function (e) {
        if ('which' in e) {
            return e.which;
        }
        else {
            // Internet Explorer before version 9
            if ('button' in e) {
                var buttons = "";
                if (e.button & 1) {
                    return GE.MB.LEFT;
                }
                if (e.button & 2) {
                    return GE.MB.RIGHT;
                }
                if (e.button & 4) {
                    return GE.MB.MIDDLE;
                }
            }
        }
        return GE.MB.NONE;
    }

});