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
                    surfSpoter[view].prototype.root = that.searchContent;
                    surfSpoter[view].prototype.root = that.spotDetailsContent;
                }, 'html'));

            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, templates).done(callback);
    },
    //Constructor
    initialize: function() {

    	//Pagecontent divs on prototype for easy accessibility
        this.rootElement = $("#appContent");
        this.searchContent = $("#searchContent");
        this.spotDetailsContent = $("#spotDetailsContent");
        this.bindEvents();
    },

    bindEvents: function() {
        // For app
        //document.addEventListener('deviceready', this.onDeviceReady, false);
        // For webbbrowser
        this.onDeviceReady();
    },

    onDeviceReady: function() {
        surfSpoter.loadTemplates(["searchSpot", "spotDetailsView"], function () {
            surfSpoter.Router = new surfSpoter.Router();
            Backbone.history.start();
        });
    },

};

//The applications available routes
surfSpoter.Router = Backbone.Router.extend({

    routes: {
        "":             "",
        "spots#:id": 	"spotDetails", 
        "search": 		"searchSpot",  
     
    },

    //Listing all spots
    searchSpot: function(){
       
        var searchContentDiv = surfSpoter.searchContent;
        searchContentDiv.empty();

        var spots = new surfSpoter.spotsModel();

        spots.fetch({
            successCallback: function(data) {

                var spotsFeedView = new surfSpoter.searchSpot({

                    model: data
                });

                searchContentDiv.append(spotsFeedView.render().el);

                //Fix for some DOM-rendering problem with jQuery Mobile styles
                //#search = page id
                $("#search").trigger("create");

            }
        });
    },

    //Details on a certain spot with id
    spotDetails: function(id) {

    	var spotDetailsContentDiv = surfSpoter.spotDetailsContent;
    	spotDetailsContentDiv.empty();

    	console.log("u want details");

    	var spot = new surfSpoter.spotModel({id: id});

    	spot.fetch({

            successCallback: function(data) {

                var spotDetailsView = new surfSpoter.spotDetailsView({

                    model: data
                });

                console.log(spotDetailsView.render().el);

                spotDetailsContentDiv.html(spotDetailsView.render().el);



            }

        });


    }

});


$(document).on("ready", function () {
    surfSpoter.initialize();

});
