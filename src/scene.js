/**
 * Game Scene.
 * @constructor
 */
GE.Scene = GE.Klass(GE.EventManager, {

    //  *****************************
    //  Class definitions
    //  *****************************

    $name: "Scene",

    $implements: [GE.IIdentificable],

    //  *****************************
    //  Attributes
    //  *****************************

    /**
     * Scene name. This identifies the scene.
     */
    name: "",

    /**
     * Resources container.
     */
    resources: null,

    /**
     * Objects identified by ID.
     */
    objects: {},

    /**
     * Objects identified by name.
     */
    objectsByName: {},

    /**
     * Objects creation queue.
     */
    objectsToCreate: [],

    /**
     * Objects destruction queue.
     */
    objectsToDelete: [],

    //  *****************************
    //  Ctor
    //  *****************************

    initialize: function() {
        this.resources = new GE.ResourceContainer();
    },


    //  *****************************
    //  Public Methods
    //  *****************************

    start: function(persistents) {

        if(persistents) {
            GE.jQuery.each(persistents, function(i, entity) {
                this.__addObject(entity);
            });
        }

		this.trigger(GE.Events.Scene.START);
        GE.engine.trigger(GE.Events.Scene.START);
        GE.engine.on(this, GE.Events.Engine.PREUPDATE, this.update);
    },

    update: function() {


        //
        //  Create objects
        //

        if (this.objectsToCreate.length > 0) {

            var executeCreateEvent = [];
            for (var i = 0; i < this.objectsToCreate.length; i++) {
                var object = this.objectsToCreate[i];
                if(object) {
                    //  this.__addObject(object); // Mv1

                    object.ready();
                    if (object.haveTrigger(GE.Events.Entity.CREATE)) {
                        executeCreateEvent.push(object);
                    }
                }
            }
            this.objectsToCreate = [];

            for (var i = 0; i < executeCreateEvent.length; i++) {
                executeCreateEvent[i].trigger(GE.Events.Entity.CREATE);
            }

        }

        //
        //  Destroy objects
        //

        if (this.objectsToDelete.length > 0) {
            for (var i = 0; i < this.objectsToDelete.length; i++) {
                var id = this.objectsToDelete[i]; // Because is an ids list
                this.__deleteObject(id);
            }

            this.objectsToDelete = [];
        }
    },

    /**
     * Change the scene to another.
     *
     * @param {Scene} nextScene Next scene.
     * @param {Array} args Extra options.
     * @returns {Entity[]} Persistent entities.
     */
    change: function(nextScene, args) {

        //
        //  Events
        //

        GE.engine.trigger(GE.Events.Scene.CHANGE, GE.jQuery.extend({}, args || {}, { current: this, next: nextScene }));
        GE.engine.off(this, GE.Events.Engine.PREUPDATE);

        //
        //  Add non-persistents to delete queue
        //

        var deleteObjects = this.findObjectsIf(function(obj) {
            return !obj.persistent;
        });

        for (var i = 0; i < deleteObjects.length; i++) {
            this.__deleteObject(deleteObjects[i], true);
        }

        //
        //  Release resources
        //

        var resources = this.resources;

        setTimeout(function() {
            resources.dispose();
        }, 10);

        //
        //  Return persistents
        //

        return this.findObjectsIf(function(obj) {
            return obj.persistent;
        });
    },

    /**
     *	Adds a new Entity to the game.
     *
     * 	@param {Entity} object Entity instance.
     * 	@method addObject
     * 	@return {int} Instance ID.
     **/
    addObject: function(object) {
        if(object.onCreate)
            object.onCreate();
        this.__addObject(object);   //  Line Moved from Mv1 to here
        this.objectsToCreate.push(object);
        return object.getId();
    },

    /**
     * 	Adds a array of Entities to the game.
     *
     * 	@param	{Array} _objects Entity array.
     * 	@method addObjects
     * 	@return {int[]} IDS from instances.
     **/
    addObjects: function(_objects) {
        var ids = [];
        for(var i = 0; i < _objects.length; i++) {
            ids[i] = this.addObject(_objects[i]);
        }
        return ids;
    },

    /**
     * 	Iterate over all Entities, executing the function "funct" for each element.
     *
     * 	@param	{function} funct Function to execute.
     * 	@method eachObject
     **/
    eachObject: function(funct) {
        for (var id in this.objects) {
            var obj = this.objects[id];
            funct(obj);
        }
    },

    /**
     * 	Removes the instance with specified ID.
     *
     * 	@param	{int|Entity} id Instance ID or Entity.
     * 	@method removeObject
     **/
    removeObject: function (id) {
        if(!id)
            return;

        if (GE.isEntity(id)) {
            id = id.getId();
        }

        if (this.objectsToDelete.indexOf(id) < 0)
            this.objectsToDelete.push(id);
    },

    /**
     * 	Removes all instances with specified name.
     *
     * 	@param	{string} name Object name.
     * 	@method removeObjects
     **/
    removeObjects: function (name) {
        var objects = this.findObjects(name);
        for (var i = 0; i < objects.length; i++) {
            var id = objects[i].__id;
            this.removeObject(id);
        }
    },

    /**
     * 	Removes all instances using a function condition.
     *
     * 	@param {function} query Conditional function. function(object) { return true || false;}
     * 	@method removeObjects
     **/
    removeObjectsIf: function (query) {
        var objects = this.findObjectsIf(query);
        for (var i = 0; i < objects.length; i++) {
            this.removeObject(objects[i]);
        }
    },

    /**
     * Gets the instance with specified ID.
     *
     * @param {int} id Instance ID.
     * @method getObject
     * @return {Entity} Instance.
     **/
    getObject: function(id) {
        return this.objects[id];
    },

    /**
     * Gets all instances with specified name.
     *
     * @param {string} name Object name.
     * @method findObjects
     * @return {Entity[]} Instances.
     **/
    findObjects: function(name) {
        var result = this.objectsByName[name];
        if(result == undefined)
            return [];
        else
            return result;
    },

    /**
     * Gets all instances with specified type.
     *
     * @param {Object|string} typeOrTypeName Object name.
     * @method findObjectsByType
     * @return {Entity[]} Instances.
     **/
    findObjectsByType: function(typeOrTypeName) {
        if(typeof typeOrTypeName === 'string') {
            typeOrTypeName = typeOrTypeName.toLowerCase();
            return this.findObjectsIf(function(o) {
                return o.$type.toLowerCase() == typeName;
            });
        }
        else {
            return this.findObjectsIf(function(o) {
                return dejavu.instanceOf(o, typeOrTypeName);
            });
        }
    },

    /**
     * Gets all instances using a function condition.
     *
     * @param {function} query Conditional function. function(object) { return true || false;}
     * @method findObjects
     * @return {Entity[]} Instances.
     **/
    findObjectsIf: function(query) {
        var result = [];
        for (var id in this.objects) {
            var o = this.objects[id];
            if(query(o)) {
                result.push(o);
            }
        }
        return result;
    },

    /**
     * Gets the first instance with specified name.
     *
     * @param {string} name Object name.
     * @method findObject
     * @return {Entity} Instance.
     **/
    findObject: function(name) {
        var result = this.objectsByName[name];
        if(typeof result === 'undefined')
            return result;
        else
            return result[0];
    },


    //  *****************************
    //  Private Methods
    //  *****************************

    /**
     * Adds the object.
     *
     * @param object
     * @private
     */
    __addObject: function(object) {
        if (object) {
            // Lists
            this.objects[object.getId()] = object;
            var objByName = this.objectsByName[object.name];
            if (this.objectsByName[object.name] == undefined) {
                this.objectsByName[object.name] = [object];
            }
            else {
                this.objectsByName[object.name].push(object);
            }


            object.scene = this;
        }
    },

    /**
     * Deletes the object.
     *
     * @param id Entity or ID.
     * @param {boolean} [cancelDeleteEvent=false] Cancel entity's destroy event call.
     * @private
     */
    __deleteObject: function(id, cancelDeleteEvent) {
        var object = GE.isEntity(id) ? id : this.objects[id];

        if (object) {
            if (!cancelDeleteEvent)
                object.trigger(GE.Events.Entity.DESTROY);

            var list = this.objectsByName[object.name];
            if(list) {
                var j = 0;
                while (j < list.length && list[j].__id != id) {
                    j++;
                }
                if (j < list.length) {
                    list.splice(j, 1);
                }
            }

            object.onDelete();
            object.dispose();
            delete this.objects[id];
            delete object;
        }
    } ,

    //  *****************************
    //  IIdentificable implementation
    //  *****************************

    /**
     * Gets the ID.
     * @returns {number}
     */
    getId: function() {
        return this.name;
    },

    /**
     * Type-independent ID.
     */
    getUId: function() {
        return "$scene("+this.$name+")"+this.name;
    }
});