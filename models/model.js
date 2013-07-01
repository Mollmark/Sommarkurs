//------------------------MODELS-----------------------
//Spots
surfSpoter.spotsFeedModel = Backbone.Model.extend({

    initialize:function () {
        this.spots = new surfSpoter.spotsFeedCollection();
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


//---------------COLLECTIONS--------------------------
//Spots
surfSpoter.spotsFeedCollection = Backbone.Collection.extend({

    model: surfSpoter.spotsFeedModel,

    sync: function(method, model, options) {
        if (method === "read") {
            surfSpoter.applicationData.getAllSpots(function (data) {
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
};

surfSpoter.applicationData = new surfSpoter.dataManager();
