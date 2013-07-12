var surfSpoter = {


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
 
        surfSpoter.Router = new surfSpoter.Router();
        Backbone.history.start();

    },

};

//The applications available routes
surfSpoter.Router = Backbone.Router.extend({

    routes: {
        "":             "home",
        "spots#:id": 	"spotDetails", 
        "search": 		"searchSpot",
        "settings": 	"settings",
        "info": 		"info",
        "goSurf": 		"goSurf",  
     
    },

    home: function(){

        this.changePage(new surfSpoter.HomeView());
    },

    info: function(){

    	this.changePage(new surfSpoter.InfoView());
    },

    settings: function(){

    	this.changePage(new surfSpoter.SettingsView());
    },

    //Listing all spots
    searchSpot: function(){

    	var that = this;

    	console.log("SEARCH");
       
        var searchContentDiv = surfSpoter.searchContent;
        searchContentDiv.empty();

        var spots = new surfSpoter.spotsModel();

        spots.fetch({
            successCallback: function(data) {
            	console.log(data);

                that.changePage(new surfSpoter.searchSpot({

                    model: data
                }));          

                //Fix for some DOM-rendering problem with jQuery Mobile styles
                //#search = page id
                //$("#search").trigger("create");

            }
        });
    },

    //Details on a certain spot with id
    spotDetails: function(id) {

    	var that = this;

    	var spotDetailsContentDiv = surfSpoter.spotDetailsContent;
    	spotDetailsContentDiv.empty();

    	console.log("u want details");

    	var spot = new surfSpoter.spotModel({id: id});

    	spot.fetch({

            successCallback: function(data) {

                that.changePage(new surfSpoter.SpotDetailsView({

                    model: data
                }));
            }    

            

        });


    },

    goSurf: function(){

    	this.changePage(new surfSpoter.GoSurfView());

    },

    changePage:function (page) {
        $(page.el).attr({'data-role': 'page', 'data-theme': 'f'});
        page.render();
        $('body').append($(page.el));
        var transition = $.mobile.defaultPageTransition;
        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }


        $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
    }

});


$(document).on("ready", function () {
    surfSpoter.initialize();

});
