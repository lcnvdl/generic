/* ****************************
  Declarations
 ****************************** */

var GE = GE || {};

GE.defaults = {
    LISTENER_PREFIX: "gengine_ev_",
    MAX_PLAYERS: 1
};

GE.Debug = false;

GE.jQuery = jQuery || $;

if(!GE.jQuery) {
    throw "jQuery is required.";
}

if(typeof dejavu === 'undefined') {
    throw "dejavu is required.";
}

GE.Klass = dejavu.Class.declare;
GE.Abstract = dejavu.AbstractClass.declare;
GE.Interface = dejavu.Interface.declare;

/**
 * Is a instance of b.
 *
 * @param a
 * @param b
 * @returns {boolean}
 */
GE.is = function(a, b) {
    return dejavu.instanceOf(a, b);
};

/**
 * Is a instance of GE.Entity.
 * @param a
 * @returns {boolean}
 */
GE.isEntity = function(a) {
    return GE.is(a, GE.Entity);
};

/* ****************************
 Browsers compatibility
 ****************************** */

if (!Object.keys) {
    Object.keys = function (obj) {
        var keys = [], k;
        for (k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
                keys.push(k);
            }
        }
        return keys;
    };
}

/* ******************************
 Misc
 ******************************** */

/**
 * Creates an alias for a variable.
 * @param {*} klass Variable or class.
 * @param {string} as Alias.
 */
GE.using = function(klass, as) {

    if(typeof as !== 'string') {
        throw "GE.using(Object, String)";
    }

    if(window[as]) {
        throw "Global "+as+ " already exists";
    }

    window[as] = AGE.Res.Model;
};

GE.efp =
GE.entityFromParam = function(xyz) {
    var result,
        scene = GE.engine.getCurrentScene();

    if(typeof xyz === 'string') {
        result = scene.findObject(xyz);
    }
    else if(typeof xyz === 'number') {
        result = scene.getObject(xyz);
    }
    else {
        result = xyz;
    }

    return result;
};

GE.sizeOf = function(obj) {

    if(typeof obj === 'array') {
        return obj.length;
    }

    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


GE.loadScript = function (url) {

    if(GE.Debug)
        console.log("Getting script: "+url);

    return GE.jQuery.ajax({
        url: url,
        dataType: 'script',
        cache: true
    });
}