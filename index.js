var surfSpoter = {

    //Constructor
    initialize: function() {

    	//Pagecontent divs on prototype for easy accessibility
        this.rootElement = $("#appContent");
        this.searchContent = $("#searchContent");
        this.spotDetailsContent = $("#spotDetailsContent");
        this.userSpotsFeed = $("#userSpotsFeed");

        this.bindEvents();
    },

    bindEvents: function() {
        // For app
        document.addEventListener('deviceready', this.onDeviceReady, false);
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
	
    //The id of the current user
	userIdConstant: 0,
    
    //This array contains users userspots, so we can check in template if user are able to follow or not
    array: [],

    userInfo:[],

    routes: {
        "": "home", 
        "user/:userId":     "home",
        "user/:userId/spot/:spotId": 	"spotDetails", 
        "user/:userId/searchSpot": 		"searchSpot",
        "settings": 	"settings",
        "info": 		"info",
        "goSurf": 		"goSurf",
        "logIn": 		"logIn",  
     
    },

  /*  check: function(){ 	

    	FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				console.log("INLOGGAD");
				surfSpoter.Router.loggedIn = true;
				console.log("true? ",surfSpoter.Router.loggedIn);
				
			} else{
				console.log("UTLOGGAD");
				surfSpoter.Router.loggedIn = false;
				console.log("true? ",surfSpoter.Router.loggedIn);
				
			}
		});
	},*/

    home: function(userId){ 

        userId = "5204dfe9139a7ff7b4000001";

        if(surfSpoter.Router.array.length > 1){

            surfSpoter.Router.array.splice(0,1);
            console.log("spliced", surfSpoter.Router.array);
        };

        var user = this.setUserId(userId);
        var wholeUser = new surfSpoter.userModel({id: user});

        wholeUser.fetch({

            successCallback: function(data) {                
               
               console.log("USER DATA", data);
               surfSpoter.Router.userInfo.push(data);
               console.log("USERINFO SET?", surfSpoter.Router.userInfo);
            }                   

        });

    	var that = this;
    	var feedDiv = surfSpoter.userSpotsFeed;
    	feedDiv.empty();
    	var spots = new surfSpoter.userSpotsModel({id: user});

    	spots.fetch({

            successCallback: function(data) {  

            console.log("USERNAME SETwterwtewtrt?", this.userName);          	

                that.changePage(new surfSpoter.HomeView({

                    model: data, usern: user, userinfo: surfSpoter.Router.userInfo
                    
                }));
               
               console.log("DATA", data);
            }    	            

        });

        console.log("Spots", spots); 	
    },

    setUserId: function(userId){
        var constantId = surfSpoter.Router.userIdConstant;
        constantId = userId
        console.log("SETUSER ID", constantId);
        return constantId;

    },

    info: function(){

    	this.changePage(new surfSpoter.InfoView());
    },

    settings: function(){


    	this.changePage(new surfSpoter.SettingsView());

    },

    logIn: function(){

    	this.changePage(new surfSpoter.LogInView());
    },

    //Listing all spots
    searchSpot: function(userId){

        console.log("CONSTANT ARRAYEN SERACH", surfSpoter.Router.array);

        if(surfSpoter.Router.array.length > 1){

            surfSpoter.Router.array.splice(1,1);
            console.log("spliced i search", surfSpoter.Router.array);
        };

    	var that = this;

    	console.log("SEARCH");
       
        var searchContentDiv = surfSpoter.searchContent;
        searchContentDiv.empty();

        var spots = new surfSpoter.spotsModel();

        spots.fetch({
            successCallback: function(data) {
            	console.log(data);

                that.changePage(new surfSpoter.searchSpot({

                    model: data, usern:userId
                }));          

                //Fix for some DOM-rendering problem with jQuery Mobile styles
                //#search = page id
                //$("#search").trigger("create");

            }
        });
    },

    //Details on a certain spot with id
    spotDetails: function(userId, spotId) {

        if(surfSpoter.Router.array.length > 1){

            surfSpoter.Router.array.splice(0,1);
            console.log("splicedi details", surfSpoter.Router.array);
        };
        var theConstant = this.setUserId(userId);
        console.log("CONSTANT ARRAYEN", surfSpoter.Router.array);
        console.log("CONSTANT in details", theConstant);
        
    	var that = this;
    	var spotDetailsContentDiv = surfSpoter.spotDetailsContent;
    	spotDetailsContentDiv.empty();

    	console.log("u want details");
    	
        var userSpots = new surfSpoter.userSpotsModel({id: theConstant});
        var spot = new surfSpoter.spotModel({id: spotId});
 
     

        $.when(
            userSpots.fetch({

                successCallback: function(data) {
                    console.log("datan i succes userspots.fetch", data);

                    surfSpoter.Router.array.push(data);
                    console.log("pushed", surfSpoter.Router.array);
                }
            })).then(function(){

            spot.fetch({
                successCallback: function(data) {               
                    console.log("datan i succes spot.fetch", data);
                    console.log("ARRAYEN I DETAILS FETCH",surfSpoter.Router.array);
                    that.changePage(new surfSpoter.SpotDetailsView({

                        model: data, followedSpots: surfSpoter.Router.array, usern: theConstant
                    }));               
                }             
            });
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
