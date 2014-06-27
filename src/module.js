/**
 * Game Engine Module.
 *
 * Events:
 *
 * @class Module
 * @constructor
 *
 */
GE.Module = GE.Abstract({

    //  *****************************
    //  Class definitions
    //  *****************************

    $name: "Module",

    $abstract: {
        /**
         * TODO DOC
         *
         * @param [success]
         * @param [fail]
         * @method load
         */
        load: function (success, fail) {},

        /**
         * TODO DOC
         *
         * @method dispose
         */
        dispose: function () {}
    },

    //  *****************************
    //  Attributes
    //  *****************************

    name: "",

    /**
     * Load needs callback?
     */
    async: false
});