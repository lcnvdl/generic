GE.Color = GE.Klass({

    $name: "Color",

    $statics: {
        red: function() {
            return new GE.Color().rgb(255, 0, 0);
        },

        green: function() {
            return new GE.Color().rgb(0, 255, 0);
        },

        blue: function() {
            return new GE.Color().rgb(0, 0, 255);
        },

        white: function() {
            return new GE.Color().rgb(255, 255, 255);
        },

        black: function() {
            return new GE.Color();
        }
    },

    r: 0,
    g: 0,
    b: 0,
    a: 1.0,

    initialize: function() {

    },

    rgba: function(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.a = a;
        this.b = b;
        return this;
    },

    rgb: function(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        return this;
    },

    ts: function() {
        return this.toString();
    },

    toString: function() {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }
});