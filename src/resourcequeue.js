/**
 * Resource load queue.
 * @type {ResourceQueue}
 * @constructor
 */
GE.ResourceQueue = GE.Klass(GE.EventManager, {

    $name: "ResourceQueue",

    resources: [],

    current: 0,

    /**
     * Adds a local/global resource.
     *
     * @param {Resource} resource
     * @param {bool} [global]
     */
    add: function(resource, global) {

        this.resources.push(resource);

        var name = resource.name;
        resource.on("_loader_", this, GE.Events.Resource.LOAD_FINISH, function(args) {
            if(args.success) {
                //
            }
            else {
                console.warn(args.result);
            }

            this.report(name);
        });

    },

    start: function() {
        this.current = 0;
        this.loadCurrent();

    },

    report: function(name) {
        this.current ++;
        if(this.current < this.resources.length) {
            this.loadCurrent();
        }
    },

    loadCurrent: function() {
        this.resources[this.current].load();
    },

    getProgress: function() {
        if(this.resources.length == 0)
            return 0;

        return this.current / this.resources.length;
    }

});
