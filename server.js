var express = require('express'),
    spot = require('./routes/spots');
 
var app = express();
 
app.configure(function () {
    app.use(express.logger('dev'));    
    app.use(express.bodyParser());
});

app.get('/users/:id/spots', spot.findSpotsByUserId);
app.put('/users/:userId/spot/:spotId/add', spot.addUserSpot); 
app.get('/spots', spot.findAll);
app.get('/spots/:id', spot.findById);
app.post('/spots/create', spot.addSpot);
app.put('/spots/:id/update', spot.updateSpot);
app.delete('/spots/:id/delete', spot.deleteSpot);
 
app.listen(3000);
console.log('port 3000');