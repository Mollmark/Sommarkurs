var surfSpoter = {

    //Laddar de templates som applikationen senare behöver
    loadTemplates: function(views, callback) {
        var that = this;
        var templates = [];

        $.each(views, function(index, view) {

            if (surfSpoter[view]) {

                templates.push($.get('templates/' + view + '.html', function(data) {
                    surfSpoter[view].prototype.template = _.template(data);
                    surfSpoter[view].prototype.root = that.rootElement;
                }, 'html'));

            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, templates).done(callback);
    },
    //Constructor
    initialize: function() {
        this.rootElement = $("#appContent");
        this.bindEvents();


    },

    bindEvents: function() {
        // For app
        //document.addEventListener('deviceready', this.onDeviceReady, false);
        // For webbbrowser
        this.onDeviceReady();
    },

    onDeviceReady: function() {
        surfSpoter.loadTemplates(["spotsFeed"], function () {
            surfSpoter.Router = new surfSpoter.Router();
            Backbone.history.start();
        });
    },

};

surfSpoter.Router = Backbone.Router.extend({

    routes: {
        "":               "spotsFeed"
     
    },

    //All spots
    spotsFeed: function(){

   
        var root = surfSpoter.rootElement;
        root.empty();


        var spots = new surfSpoter.spotsFeedModel();


        spots.fetch({
            successCallback: function(data) {

                var spotsFeedView = new surfSpoter.spotsFeed({

                    model: data
                });

                root.append(spotsFeedView.render().el);

                //Fix for some DOM-rendering problem
                //#home = page id
                $("#home").trigger("create");

            }
        });
    }

});


$(document).on("ready", function () {
    surfSpoter.initialize();

});
