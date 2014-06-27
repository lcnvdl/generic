//  TODO: TEST

var KEY_UP = 0;
var KEY_PRESSED = 1;
var KEY_DOWN = 2;
var KEY_RELEASED = 3;

GE.KeyboardDefaults = {

};

GE.KeyboardDevice = GE.Klass(GE.InputDevice, {

    //  *****************************
    //  Class definitions
    //  *****************************

    $name: "KeyboardDevice",

    //  *****************************
    //  Attributes
    //  *****************************

    names: 0,
    codes: 0,

    __keys: [],
    __newKeys: {},

    __listeners: {},

    //  *****************************
    //  Ctor
    //  *****************************

    initialize: function() {
        this.$super();

        GE.engine.keyboard = this;

        this._status = GE.DeviceStatus.CONNECTED;
    },

    //  *****************************
    //  Overrides
    //  *****************************

    start: function() {
        this.$super();

        this.__createEvents();
        this.__attachEvents();
        this.__loadCodes();
        this._addAxis();

        GE.engine.on(this.getUId(), this, GE.Events.Engine.POSUPDATE, function() {

            for (var i = 0; i < this.__keys.length; i++) {
                if (this.__newKeys[i] == undefined) {
                    switch (this.__keys[i]) {
                        case KEY_PRESSED:
                        {
                            this.__keys[i] = KEY_DOWN;
                        } break;
                        case KEY_RELEASED:
                        {
                            this.__keys[i] = KEY_UP;
                        } break;
                    }
                }
            }
            this.__newKeys = {};

        }.$member().bind(this));

        return this;
    },

    stop: function() {
        this.$super();
        this.__detachEvents();
        return this;
    },

    //  *****************************
    //  Public methods
    //  *****************************

    keycode: function (searchInput) {
        if ('number' === typeof searchInput) return this.names[searchInput];
        var search = String(searchInput);
        var foundNamedKey = this.codes[search.toLowerCase()];
        if (foundNamedKey) return foundNamedKey;
        if (search.length === 1) return search.charCodeAt(0);
        return undefined;
    },

    isPressed: function (key) {
        return this.__keys[this.keycode(key)] == KEY_PRESSED;
    },

    isReleased: function(key) {
        return this.__keys[this.keycode(key)] == KEY_RELEASED;
    },

    isDown: function(key) {
        return this.__keys[this.keycode(key)] == KEY_DOWN;
    },

    isUp: function(key) {
        return this.__keys[this.keycode(key)] == KEY_UP
    },

    //  *****************************
    //  Private methods
    //  *****************************

    __loadCodes: function () {
        var codes = {
            'backspace': 8,
            'tab': 9,
            'enter': 13,
            'shift': 16,
            'ctrl': 17,
            'alt': 18,
            'pause/break': 19,
            'caps lock': 20,
            'esc': 27,
            'space': 32,
            'page up': 33,
            'page down': 34,
            'end': 35,
            'home': 36,
            'left': 37,
            'up': 38,
            'right': 39,
            'down': 40,
            'insert': 45,
            'delete': 46,
            'windows': 91,
            'right click': 93,
            'numpad *': 106,
            'numpad +': 107,
            'numpad -': 109,
            'numpad .': 110,
            'numpad /': 111,
            'num lock': 144,
            'scroll lock': 145,
            'my computer': 182,
            'my calculator': 183,
            ';': 186,
            '=': 187,
            ',': 188,
            '-': 189,
            '.': 190,
            '/': 191,
            '`': 192,
            '[': 219,
            '\\': 220,
            ']': 221,
            "'": 222
        };

        for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32;
        for (var i = 48; i < 58; i++) codes[i - 48] = i;
        for (i = 1; i < 13; i++) codes['f' + i] = i + 111;
        for (i = 0; i < 10; i++) codes['numpad ' + i] = i + 96;

        var names = {};

        for (i in codes) names[codes[i]] = i;

        for (i = 0; i < 255; i++) {
            this.__keys[i] = KEY_UP;
        }

        this.codes = codes;
        this.names = names;
    },

    __createEvents: function() {

        this.__listeners["keydown"] = function(e) { GE.engine.keyboard.__onKeyDown(e);}.$member();
        this.__listeners["keyup"] = function(e) {GE.engine.keyboard.__onKeyUp(e);}.$member();

    },

    __attachEvents: function () {
        try {
            GE.jQuery.each(this.__listeners, function(k, v) {
                document.addEventListener(k, v, false);
            });
        }
        catch(err) {
            console.log("Error loading "+this.getId()+" "+err);
        }
    },

    __detachEvents: function () {
        try {
            GE.jQuery.each(this.__listeners, function(k, v) {
                document.removeEventListener(k, v, false);
            });

            this.__listeners = {};
        }
        catch(err) {
            console.log("Error unloading "+this.getId()+" "+err);
        }
    },

    __onKeyDown: function (e) {
        var value = this.__keys[e.keyCode];
        if (value == KEY_UP || value == KEY_RELEASED) {
            value = KEY_PRESSED;
            this.__keys[e.keyCode] = value;
        }
    },

    __onKeyUp: function (e) {
        var value = this.__keys[e.keyCode];
        if (value == KEY_DOWN || value == KEY_PRESSED) {
            value = KEY_RELEASED;
            this.__keys[e.keyCode] = value;
        }
    }
});