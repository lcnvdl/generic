/* ****************************
    Math extension
 ****************************** */

/**
 *	Math lerp.
 *
 *	@method Math.lerp
 *	@param {float} a Current value.
 *	@param {float} b Target value.
 *	@param {float} x Percent/100 (value between 0.0 and 1.0).
 *	@static
 *	@return {float} result
 **/
Math.lerp = Math.lerp || function(a, b, x) {
    return a + x * (b - a);
};

Math.toRad = Math.toRad || function(deg) {
    return deg * Math.PI / 180;
};

Math.toDeg = Math.toDeg || function(rad) {
    return rad * 180 / Math.PI;
};

Math.sign = Math.sign || function(x) {
    return typeof x == 'number' ? x ? x < 0 ? -1 : 1 : isNaN(x) ? NaN : 0 : NaN;
};

Math.sqr = Math.sqr || function(x) {
    return x*x;
};

Math.choose = Math.choose || function() {

    var arr;

    if(arguments.length > 1) {
        arr = arguments;
    }
    else if(GE.jQuery.isArray(arguments[0])) {
        arr = arguments[0];
    }
    else {
        return arguments[0];
    }

    return arr[Math.floor(Math.random() * arr.length)];
};

/* ****************************
 Game helpers
 ****************************** */

Math.dist = Math.dist || function(x1, y1, x2, y2) {
    return Math.sqrt(Math.sqr(x2 - x1) + Math.sqr(y2 - y1));
};

Math.dist3 = Math.dist3 || function(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt(Math.sqr(x2 - x1) + Math.sqr(y2 - y1) + Math.sqr(z2 - z1));
};

Math.angle = Math.angle || function(x1, y1, x2, y2) {
    throw "Not implemented";
};

Math.angle3 = Math.angle || function(x1, y1, z1, x2, y2, z2) {
    throw "Not implemented";
};