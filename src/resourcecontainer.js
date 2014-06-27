/**
 * Resource Container.
 * @type {ResourceContainer}
 * @constructor
 */
GE.ResourceContainer = GE.Klass({

    $name: "ResourceContainer",

    $statics: {
        globalRes: {}
    },

    resources: {},

    /**
     * Adds a local/global resource.
     *
     * @param {Resource} resource
     * @param {bool} [global]
     */
    add: function(resource, global) {

        var list;

        if(global) {
            list = GE.ResourceContainer.$static.globalRes;
        }
        else {
            list = this.resources;
        }

        list[resource.name] = resource;
    },

    /**
     * Gets a local resource.
     * @param name
     * @param [global]
     * @returns {*}
     */
    get: function(name, global) {
        if(global) {
            return GE.ResourceContainer.$static.globalRes[name];
        }
        return this.resources[name];
    },

    /**
     * Load the resources.
     *
     * @param [args]
     */
    load: function(args) {

        args = args || {};

        GE.jQuery.each(this.resources, function(k, r) {
            if(!r.loaded) {
                r.load(args[k]);
            }
        });

        return this;
    },

    /**
     * Disposes an specific resource.
     *
     * @param {string} name
     * @param [global]
     */
    release: function(name, global) {

        var list;

        if(global) {
            list = GE.ResourceContainer.$static.globalRes;
        }
        else {
            list = this.resources;
        }

        if(list[name]) {
            list[name].dispose();
            delete list[name];
        }

        return this;
    },

    /**
     * Releases all resources.
     *
     * Class reusable.
     *
     * @param [globals] Include globals?
     */
    dispose: function(globals) {

        GE.jQuery.each(this.resources, function(k, v) {
            v.dispose();
        });

        if(globals) {

            GE.jQuery.each(GE.ResourceContainer.$static.globalRes, function(k, v) {
                v.dispose();
            });

            GE.ResourceContainer.$static.globalRes = {};
        }

        this.resources = {};
    }

});
