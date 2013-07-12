//Localy
/*var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('spotdb', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("failed to connect to 'spotdb' database");
        db.collection('spots', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'spots' collection dont exist. Creating it with dbseed");
                dbSeed();
            }
        });
    }
});*/


 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Get spot: ' + id);
    db.collection('spots', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('spots', function(err, collection) {
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
 

var dbSeed = function() {
 
    var spots = [
    {
        name: "Haga-Park",
        description: "Bra vindsäker spot. Brisen vid soligt väder och sydvästliga vindar ger mycket vind.",
        wind: "8",
        windDirection: "SV",
        wavetype: "chop",
        picture: "haga.jpg"
    },
    {
        name: "Sandbergen",
        description: "Ligger söder om Haga-Park. Här håller man till på sommaren när det är badgäster på Haga-Park.",
        wind: "7",
        windDirection: "SV",
        wavetype: "chop",
        picture: "sandbergen.jpg"
    }];
 
    db.collection('spots', function(err, collection) {
        collection.insert(spots, {safe:true}, function(err, result) {});
    });
 
};