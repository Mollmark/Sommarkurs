//------------------------MODELS-----------------------
//All Spots
surfSpoter.spotsModel = Backbone.Model.extend({

    initialize:function () {
        this.spots = new surfSpoter.spotsCollection();
        this.spots.parent = this;
    },

    sync: function(method, model, options) {
        if (method === "read") {

				surfSpoter.applicationData.getAllSpots(function (data) {

                options.successCallback(data);
            });
        }
    }


});

//Spots with user id
surfSpoter.userSpotsModel = Backbone.Model.extend({



    initialize:function () {
        this.spots = new surfSpoter.userSpotsCollection();
        this.spots.parent = this;
    },

    sync: function(method, model, options) {
        if (method === "read") {

                surfSpoter.applicationData.getSpotsByUserId(this.id, function (data) {

                options.successCallback(data);

            });
        }
    }


});


//One singel spot
surfSpoter.spotModel = Backbone.Model.extend({

    sync: function(method, model, options) {
        if (method === "read") {

                surfSpoter.applicationData.getSpotById(this.id,function (data) {

                options.successCallback(data);

            });
        }
    }


});


//---------------COLLECTIONS--------------------------
//All Spots
surfSpoter.spotsCollection = Backbone.Collection.extend({

    model: surfSpoter.spotsModel,

    sync: function(method, model, options) {
        if (method === "read") {
            surfSpoter.applicationData.getAllSpots(function (data) {
                options.successCallback(data);
            });
        }
    }

});

//Spots by user id
surfSpoter.userSpotsCollection = Backbone.Collection.extend({

    model: surfSpoter.userSpotsModel,

    sync: function(method, model, options) {
        if (method === "read") {
            surfSpoter.applicationData.getSpotsByUserId(function (data) {
                console.log(data);
                options.successCallback(data);
            });
        }
    }

});


//------------------DATA FROM API------------------------------
surfSpoter.dataManager = function (successCallback, errorCallback) {


    this.getAllSpots = function (callback) {

        $.ajax({

            dataType: "json",
            url: "http://127.0.0.1:3000/spots",
            type: "GET",

            success: function (data) {

                console.log("data i model: ", data);

                callback(data);


            },
            error: function(object, error) {
                console.log(error);
            }
        });

    };

    this.getSpotById = function (id, callback) {

    var url = "http://127.0.0.1:3000/spots/"+id;
    console.log(url);
    $.ajax({

            dataType: "json",
            url: url,
            type: "GET",

            success: function (data) {

                callback(data);

            },
            error: function(object, error) {
                console.log(error);
            }
        });

    };

    this.getSpotsByUserId = function (id, callback) {

    var url = "http://127.0.0.1:3000/users/"+id+"/spots";
    console.log(url);
    $.ajax({

            dataType: "json",
            url: url,
            type: "GET",

            success: function (data) {

                callback(data);

            },
            error: function(object, error) {
                console.log(error);
            }
        });

    };
};

surfSpoter.applicationData = new surfSpoter.dataManager();
