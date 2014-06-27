GE.ResourceStatus = {
    NONE: 0,
    SUCCESS: 1,
    FAIL: -1
};

/**
 * Abstract game resource.
 * @type {Resource}
 * @constructor
 */
GE.Resource = GE.Abstract(GE.EventManager, {

    //  *****************************
    //  Class Definitions
    //  *****************************

    $name: "Resource",

    $abstracts: {

        /**
         * Starts the load. Override if you want to make children resources.
         */
        load: function(args){}

    },

    //  *****************************
    //  Attributes
    //  *****************************

    /**
     * Resource name (Identifier).
     */
    name: "",

    /**
     * Resource type. Example: sprite, model, sound, etc.
     */
    type: "generic",

    /**
     * Is resource loaded?
     */
    loaded: false,

    /**
     * Resource status.
     */
    status: GE.ResourceStatus.NONE,

    /**
     * Resource.
     */
    _resource: null,


    //  *****************************
    //  Constructor
    //  *****************************


    /**
     * Constructor.
     *
     * @param [opts] Options.
     * @param {string} [opts.name] Name.
     * @param {string} [opts.type] Resource type.
     */
    initialize: function(opts) {
        this.type = opts.type || this.type;
        this.name = opts.name || '';

        if(!this.name || this.name == '')
            throw 'A resource must have a unique name.'
    },


    //  *****************************
    //  Methods
    //  *****************************

    /**
     * Gets the resource loaded. Virtual function.
     */
    getRes: function() {
        return this._resource;
    },

    /**
     * Assign the value from the loaded resource and trigger success events.
     *
     * @param res Loaded resource.
     */
    success: function(res) {
        this._resource = res;
        this.loaded = true;
        this.status = GE.ResourceStatus.SUCCESS;

        this.trigger(GE.Events.Resource.LOAD_SUCCESS, this);
        this.trigger(GE.Events.Resource.LOAD_FINISH, {success: true, resource: this, result: res});

        return this;
    },

    /**
     * Trigger error events.
     *
     * @param message Error message or object.
     */
    fail: function(message) {
        this._resource = null;
        this.loaded = true;
        this.status = GE.ResourceStatus.FAIL;

        console.warn(message);

        this.trigger(GE.Events.Resource.LOAD_FAIL, this);
        this.trigger(GE.Events.Resource.LOAD_FINISH, {success: false, result: message, resource: this});

        return this;

    },

    /**
     * Releases the resource.
     */
    dispose: function() {
        this._resource = null;
        this.loaded = false;
    }

});
