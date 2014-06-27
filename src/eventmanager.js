/**
 * Event.
 *
 * @type {Event}
 */
GE.Event = GE.Klass({
    $name: "Event",

    __objects: {},
    __subscriptions: {},

    initialize: function() {

    },

    add: function(id, obj, fn) {
        this.__objects[id] = obj;
        if(typeof this.__subscriptions[id] === 'undefined') {
            this.__subscriptions[id] = [];
        }

        this.__subscriptions[id].push(fn);
    },

    remove: function(id) {
        delete this.__objects[id];
        delete this.__subscriptions[id];
    },

    run: function(args) {
        var rmv = [];
        var $this = this;

        GE.jQuery.each(this.__subscriptions, function(id, fns) {
            var obj = $this.__objects[id];

            if(obj) {

                for(var i = 0; i < fns.length; i++) {
                    fns[i].call(obj, args);
                }

            }
            else {
                rmv.push(id);
            }

        });

        for(var i = 0; i < rmv.length; i++) {
            this.remove(rmv[i]);
        }
    }

});

/**
 * Events manager.
 *
 * @type {EventManager}
 */
GE.EventManager = GE.Klass({

    events: {},

    haveTrigger: function(ev) {
        return typeof this.events[ev] !== 'undefined';
    },

    /**
     * on(id, object, event name, callback)
     * on(object, event name, callback)
     * this.on(event name, callback)
     *
     * @param {string|Entity|Scene} id
     * @param {function|Entity} obj
     * @param {string|function} [ev]
     * @param {function} [fn]
     * @returns {*}
     */
    on: function(id, obj, ev, fn){

        //  this.on(a, b)
        if(typeof obj === 'function' && !ev && !fn) {


            fn = obj;
            ev = id;
            id = this.__parseId(this);
            obj = this;

        }
        //  on(a, b, c)
        else if(typeof id !== 'string') {

            fn = ev;
            ev = obj;
            obj = id;

            id = this.__parseId(id);

        }

        if(!this.haveTrigger(ev)) {
            this.events[ev] = new GE.Event();
        }

        this.events[ev].add(id, obj, fn);

        return this;
    },

    /**
     * off(id, ev)
     * off(id, "all")
     * off("all", ev)
     * off(ev)
     *
     * @param id
     * @param ev
     * @returns {*}
     */
    off: function(id, ev) {
        //
        //  Opt 4: Delete the specified event from the object "_".
        //

        if(typeof ev === 'undefined') {
            ev = id;
            id = "_";
        }

        id = this.__parseId(id);

        //
        //  Opt 2: Delete all object's events
        //

        if(ev == 'all') {

            throw "Not implemented.";

            //return this;
        }

        //
        //  Opt 3: Delete all events from an object
        //

        if(id == 'all') {

            var $this = this;
            GE.jQuery.each(this.events, function(k, v) {
                $this.off(id, k);
            });

            return this;
        }

        //
        //  Opt 1: Delete an event from an object
        //

        var e = this.events[ev];

        if(e) {
            e.remove(id);
        }
        else {
            throw "Unknown event: "+ev;
        }

        return this;
    },

    trigger: function(ev, args) {
        var e = this.events[ev];
        if(e) {
            e.run(args);
        }

        return this;
    },

    __parseId: function(id) {
        if(typeof id !== 'string') {
            if(GE.is(id, GE.IIdentificable)) {
                id = id.getUId();
            }
            /*else if(id instanceof GE.Scene) {
                id = id.name || id.$name; // TODO: warning
            }*/
            else {
                id = "_";
                console.warn("Unknown type for ID");
            }
        }

        return id;
    }
});