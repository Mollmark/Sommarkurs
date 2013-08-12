//Localy
var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('spotdb', server);
 
db.open(function(err, db) {
   

    if(!err) {
        
        console.log("Connected to 'spotdb' database");
        db.collection('spots', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'spots' collection dont exist. Creating it with dbseed");
                dbSeed();
                
            }
        });


        db.collection('users', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'users' collection dont exist. Creating it with dbseed");
                dbSeed();
                
            }
        });
    }

   
     
});

exports.findAllUsers = function(req, res) {
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findSpotsByUserId = function(req, res) {
    var id = req.params.id;   

    db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, user) {

            if (err) {
                res.send({'error':'Couldnt find user'});
            } else {
                req.session.userId = id;
                console.log("SESSION",req.session.userId);               
            }
            

            db.collection('spots', function(err, collection) {
                var spotsArray = []
                console.log("user undefined? ",user);
                console.log("userspots ",user.userspots);

                var spotIds = user.userspots
                console.log("spotIds", spotIds);

                for (var i = 0; i < spotIds.length; i++) {
                    spotIds[i]
                
                    collection.findOne({'_id':new BSON.ObjectID(spotIds[i])}, function(err, item) {
                    
                    spotsArray.push(item);
                    console.log("spotsArray i loop", spotsArray)

                    if(spotIds.length === spotsArray.length){

                        res.send(spotsArray);

                    }
                 
                    });
                };
                
            });
        });
    });
};

 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Get spot: ' + id);
    console.log("SESSION!",req.session.userId);
    db.collection('spots', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findUserById = function(req, res) {
    var id = req.params.userId;
    console.log('Get user: ' + id);

    db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    console.log("SESSION!",req.session.userId);
    db.collection('spots', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAllUsers = function(req, res) {
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addSpot = function(req, res) {
    var spot = req.body;
    console.log('Adding spot: ' + JSON.stringify(spot));
    db.collection('spots', function(err, collection) {
        collection.insert(spot, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updateSpot = function(req, res) {
    var id = req.params.id;
    var spot = req.body;
    console.log('Updating spot: ' + id);
    console.log(JSON.stringify(spot));
    db.collection('spots', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, spot, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating spot: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(spot);
            }
        });
    });
}

exports.addUserSpot = function(req, res) {

    var user = req.params.userId;
    var spot = req.params.spotId; //51e6a1116074a10c9c000006
    //console.log("SESSION!!!!!!!!!!!!!!!!!!!!!!!!",req.session.userId);

    console.log('Updating userspots for user: ' + user);
    console.log("spot: ", spot);

    db.collection('users', function(err, collection) {
        console.log("update or insert?");
        collection.update({'_id':new BSON.ObjectID(user)}, {$addToSet: { userspots: spot}}, function(err, result){
            res.json(200, result);
        });
    
    });
}

exports.deleteUserSpot = function(req, res) {
    var user = req.params.userId; //51e6a1116074a10c9c000007
    var spot = req.params.spotId; //51e6a1116074a10c9c000006
    console.log('Deleting userspots for user: ' + user);
    console.log("spot deleting: ", spot);

    db.collection('users', function(err, collection) {


        collection.update({'_id':new BSON.ObjectID(user)}, {$pull: { userspots: spot}}, function(err, result){
            res.json(200, result);
        });

    });
}

exports.deleteSurferOnSpot = function(req, res) {
    var userId = req.params.userId; //51e6a1116074a10c9c000007
    var spot = req.params.spotId; //51e6a1116074a10c9c000006
    console.log('Stop surfing for user: ' + userId);
    console.log("spot stop surfing on: ", spot);

    db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(userId)}, function(err, user) {

            if (err) {
                res.send({'error':'Couldnt find user'});
            } 

            db.collection('spots', function(err, collection) {


                collection.update({'_id':new BSON.ObjectID(spot)}, {$pull: { surfersonspot: user.username}}, function(err, result){
                    res.json(200, result);
                });
            });
        });
    });
}


exports.addSurferOnSpot = function(req, res){

    var userId = req.params.userId;
    var spot = req.params.spotId;
    console.log('Updating suerfers on spot for user: ' + userId);
    console.log("Adds surfer to spot: ", spot);


    db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(userId)}, function(err, user) {

            if (err) {
                res.send({'error':'Couldnt find user'});
            } 

            db.collection('spots', function(err, collection) {
                collection.update({'_id':new BSON.ObjectID(spot)}, {$addToSet: { surfersonspot: user.username}}, function(err, result){
                    res.json(200, result);
                });       
            });
        });
    });
}

exports.deleteSpot = function(req, res) {
    var id = req.params.id;
    console.log('Deleting spot: ' + id);
    db.collection('spots', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

exports.deleteUser = function(req, res) {
    var id = req.params.userId;
    console.log('Deleting user: ' + id);
    db.collection('users', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' user deleted');
                res.send(req.body);
            }
        });
    });
}
 

var dbSpotsSeed = function() {
 
    var spots = [
    {
        name: "Haga-Park",
        description: "Bra vindsäker spot. Brisen vid soligt väder och sydvästliga vindar ger mycket vind.",
        wind: "8",
        windDirection: "SV",
        wavetype: "chop",
        picture: "haga.jpg",
        surfersonspot: ["surfper"]
    },
    {
        name: "Sandbergen",
        description: "Ligger söder om Haga-Park. Här håller man till på sommaren när det är badgäster på Haga-Park.",
        wind: "7",
        windDirection: "SV",
        wavetype: "chop",
        picture: "sandbergen.jpg",
        surfersonspot: ["surfper"]

    },
    {
        name: "Bläsinge",
        description: "Bra vindsäker spot. Brisen vid soligt väder och sydvästliga vindar ger mycket vind.",
        wind: "8",
        windDirection: "SV",
        wavetype: "chop",
        picture: "haga.jpg",
        surfersonspot: ["surfper"]
    },
    {
        name: "Böda-sand",
        description: "Bra vindsäker spot. Brisen vid soligt väder och sydvästliga vindar ger mycket vind.",
        wind: "8",
        windDirection: "SV",
        wavetype: "chop",
        picture: "haga.jpg",
        surfersonspot: []
    },
    {
        name: "Färjestaden",
        description: "Bra vindsäker spot. Brisen vid soligt väder och sydvästliga vindar ger mycket vind.",
        wind: "8",
        windDirection: "SV",
        wavetype: "chop",
        picture: "haga.jpg",
        surfersonspot: []
    },
    {
        name: "Kleva",
        description: "Bra vindsäker spot. Brisen vid soligt väder och sydvästliga vindar ger mycket vind.",
        wind: "8",
        windDirection: "SV",
        wavetype: "chop",
        picture: "haga.jpg",
        surfersonspot: []
    }];

 
    db.collection('spots', function(err, collection) {
        collection.insert(spots, {safe:true}, function(err, result) {});
    });
 
};

var dbUsersSeed = function() {
 
    var users = [
    {
        fbname: "per.mollmark",
        email: "per.mollmark@hotmail.com",
        username: "surfper",
        userspots: ["5204df268e0d2882b4000001", "5204df268e0d2882b4000002", "5204df268e0d2882b4000003"]
    }];

    var surfSessions = [
    {
        username: "surfper",
        surfspotid: "5204df268e0d2882b4000001"
    },
    {
        username: "surfper",
        surfspotid: "5204df268e0d2882b4000002"

    },
    {
        username: "surfper",
        surfspotid: "5204df268e0d2882b4000003"

    }];
    

    db.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {});
    });

    db.collection('surfSessions', function(err, collection) {
        collection.insert(surfSessions, {safe:true}, function(err, result) {});
    });
 
};