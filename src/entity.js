/**
 * Game Entity.
 *
 * @type {Entity}
 */
GE.Entity = GE.Klass(GE.EventManager, {

    //  *****************************
    //  Class Definitions
    //  *****************************

    $name: "Entity",

    $type: "entity",

    $implements: [GE.IIdentificable],

    $locked: false,

    //  *****************************
    //  Attributes
    //  *****************************

    /**
     * Instance id.
     */
    __id: 0,

    /**
     * Persistent.
     */
    persistent: false,

    /**
     * Current scene (instance).
     */
    scene: null,

    /**
     * Friendly name.
     */
    name: "",

    /**
     * Components.
     */
    components: {},

    //  *****************************
    //  Engine events (only for
    //      generics game entities)
    //  *****************************

    onCreate: function(){},
    onDelete: function(){},


    //  *****************************
    //  Constructor
    //  *****************************

    initialize: function() {
        //  DO NOT OVERRIDE, USE READY

        this.__id = GE.engine.$static.incrementId();
    },


    //  *****************************
    //  Methods
    //  *****************************

    ready: function() {

    },

    /**
     * TODO DOC
     *
     * @method addComponent
     */
    addComponent: function (component) {
        var id = component.getId();

        if (this.getComponent(id) == null) {

            this.components[id] = component;

            component.entity = this;
            component.load();

        }

        return this;
    },

    /**
     * TODO DOC
     *
     * @param {string|number} arg  Name or ID
     * @method getComponent
     */
    getComponent: function (arg) {
        if(typeof arg === 'number') {
            return this.components[arg];
        }
        else if(typeof arg === 'string') {

            var result = null;
            var name = arg.toLowerCase();

            this.eachComponent(function(comp) {
                if(result === null) {
                    if(comp.getName().toLowerCase() == name) {
                        result = comp;
                    }
                }
            });

            return result;
        }
        else {
            throw "The param must be a string or number.";
        }

    },

    /**
     * TODO DOC
     *
     * @param {string|number} arg  Name or ID
     * @method getComponents
     */
    getComponents: function (arg) {
        if(typeof arg === 'number') {
            return [this.components[arg]];
        }
        else if(typeof arg === 'string') {

            var result = [];
            var name = arg.toLowerCase();

            this.eachComponent(function(comp) {
                if(comp.getName().toLowerCase() == name) {
                    result.push(comp);
                }
            });

            return result;
        }
        else {
            throw "The param must be a string or number.";
        }
    },

    /**
     * TODO DOC
     *
     * @param {string} arg  Type
     * @method getComponents
     */
    getComponentsFromType: function (arg) {
        if(typeof arg === 'string' && arg) {

            var result = [];
            var type = arg.toLowerCase();

            this.eachComponent(function(comp) {
                if(comp.$name.toLowerCase() == type) {
                    result.push(comp);
                }
            });

            return result;
        }
        else {
            throw "The param must be a string.";
        }
    },

    /**
     * TODO DOC
     *
     * @method hasComponents
     */
    hasComponents: function() {
        return Object.keys(this.components).length>0;
    },

    /**
     * TODO DOC
     *
     * @method eachComponent
     */
    eachComponent: function(funct) {
        for(var key in this.components)
        {
            if (this.components.hasOwnProperty(key))
            {
                funct(this.components[key]);
            }
        }
        return this;
    },

    /**
     * Free all object's resource after delete.
     */
    dispose: function() {

        //  Release components

        this.eachComponent(function(comp) {
            if(comp) {
                comp.dispose();
            }
        });

        delete this.components;

        //  Dispose event

        this.trigger(GE.Events.Generic.DISPOSE);
    },

    /**
     * Removes the object. IDEM to Scene.removeObject.
     */
    destroy: function() {
        this.scene.removeObject(this);
    },

    /**
     * Gets the ID.
     * @returns {number}
     */
    getId: function() {
        return this.__id;
    },

    /**
     * Type-independent ID.
     */
    getUId: function() {
        return "$entity("+this.$name+")"+String(this.__id);
    }
});