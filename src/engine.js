/**
 * Game Engine.
 * @type {Engine}
 * @constructor
 */
GE.Engine = GE.Klass(GE.EventManager, {

    //  *****************************
    //  Class definitions
    //  *****************************

    $name: "Engine",

    $locked: false,

    $statics: {
        idCounter: 0,

        incrementId: function() {
            return ++GE.Engine.$static.idCounter;
        }
    },


    //  *****************************
    //  Attributes
    //  *****************************

    /**
     * Current scene (ID).
     */
    currentScene: null,

    /**
     * Next scene (ID).
     */
    changeScene: null,

    /**
     * Scenes.
     */
    scenes: {},

    /**
     * Modules.
     */
    modules: {},

    /**
     * Input manager.
     */
    input: null,


    //  *****************************
    //  Ctor
    //  *****************************

    initialize: function() {
        GE.engine = this;
        this.input = new GE.InputManager();
    },


    //  *****************************
    //  Engine Methods
    //  *****************************

    /**
     * TODO: Implement a better load for async modules.
     *
     * @param defaultScene
     * @param [debug]
     * @returns {Engine}
     */
    start: function(defaultScene, callback) {


        if(GE.Debug)
            console.log("DEBUG MODE ON");

        this.input.detectDevices();

        this.changeScene = defaultScene;

        var asyncs = 0;

        var call = function(e) {
            if(GE.Debug)
                console.log("Loaded '"+e+"'");
            if(-- asyncs == 0 && callback) {
                if(GE.Debug)
                    console.log("Async load finished");
                callback();
            }
        };

        var load = function(mod, name) {
            try {
                if(mod.async) {
                    asyncs ++;
                    try {
                        mod.load(call, call);
                    }
                    catch(e) {
                        asyncs --;
                        throw e;
                    }
                }
                else {
                    mod.load();
                    if(GE.Debug)
                        console.log('Loaded "'+mod.name+'"');
                }
            }
            catch(e) {
                console.error(
                    'Error loading module "'+name+'".'+ ( GE.Debug ? (" "+e):"" )
                );
            }
        };

        GE.jQuery.each(this.modules, function(k, v) {
            if(GE.Debug) {
                console.log('Loading module "'+k+'"...');
            }
            load(v);
        });

        return this;
    },

    update: function(args) {

        if(this.currentScene != this.changeScene) {

            var persistentEntities = this.currentScene ? this.getCurrentScene().change(this.changeScene, args) : {};
            var nextScene = this.getScene(this.changeScene);

            if(nextScene == null) {
                var scene = this.changeScene;
                this.changeScene = this.currentScene;
                throw "Error, scene "+scene+" not found";
            }

            nextScene.start(persistentEntities);

            this.currentScene = this.changeScene;
        }


        //
        //  Create+delete objects
        //

        //this.getCurrentScene().update();

        //
        //  Update objects
        //

        this.trigger(GE.Events.Engine.PREUPDATE, args);
        this.trigger(GE.Events.Engine.UPDATE, args);
        this.trigger(GE.Events.Engine.POSUPDATE, args);

    },

    stop: function() {

        return this;

    },


    //  *****************************
    //  Public Methods
    //  *****************************

    addModule: function(mod) {
        this.modules[mod.name] = mod;
        return this;
    },

	/**
	 * Adds a single scene or an array of scenes into the engine.
	 */
    setScenes: function(scenes) {
		if(GE.jQuery.isArray(scenes)) {
			for(var i = 0; i < scenes.length; i++) {
				var sc = scenes[i];
				this.scenes[sc.name] = sc;
			}
		}
		else {
			this.scenes = GE.jQuery.extend({}, this.scenes, scenes);
		}

        return this;
    },

    /**
     * Gets a specific scene.
     * @param sceneId
     * @returns {*}
     */
    getScene: function(sceneId) {
        return this.scenes[sceneId];
    },

    /**
     * Gets the current scene.
     * @returns {*}
     */
    getCurrentScene: function() {
        return this.getScene(this.currentScene);
    }
});