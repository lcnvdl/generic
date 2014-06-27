/**
 * Object component.
 *
 * Events:
 *
 * @class Component
 * @constructor
 *
 */
GE.Component = GE.Abstract(GE.EventManager, {

    //  *****************************
    //  Class Definitions
    //  *****************************

    $name: "Component",

    $implements: [GE.IIdentificable],

    $statics: {
        componentId: 1
    },

    $abstract: {
        /**
         * TODO DOC
         *
         * @method load
         */
        load: function () {},

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

    /**
     * Id.
     */
    __id: 0,

    /**
     * Component's instance name.
     */
    __name: null,

    /**
     * Attached to entity.
     */
    entity: null,


    //  *****************************
    //  Constructor
    //  *****************************

    /**
     * TODO DOC
     *
     * @param {string} [name=''] Instance name.
     * @method initialize
     */
    initialize: function (name) {
        this.$super();
        this.__id = GE.Component.$static.componentId++;
        this.__name = name || "";
    },


    //  *****************************
    //  Public Methods
    //  *****************************

    /**
     * Unique component in instance?
     *
     * @returns {boolean} Result. Default: false.
     */
    isUnique: function() {
        return false;
    },

    /**
     * TODO DOC
     *
     * @returns {string}
     */
    getName: function() {
        return this.__name;
    },

    /**
     * TODO DOC
     *
     * @param {string} value Name
     * @returns {*}
     */
    setName: function(value) {
        this.__name = value;
        return this;
    },

    /**
     * TODO DOC
     *
     * @returns {number}
     */
    getId: function() {
        return this.__id;
    },

    /**
     * Type-independent ID.
     */
    getUId: function() {
        return "$com("+this.$name+")"+String(this.__id);
    },

    /**
     * TODO DOC
     *
     * @returns {string}
     */
    toString: function() {
        return this.getUId();
    }
});