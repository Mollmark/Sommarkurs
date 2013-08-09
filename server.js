var express = require('express'),
    spot = require('./routes/spots');
 
var app = express();
 
app.configure(function () {
    app.use(express.logger('dev'));    
    app.use(express.bodyParser());
    app.use(express.cookieParser());
	app.use(express.session({secret: '1234'}));
	app.use(app.router);
});

app.get('/user/:id/spots', spot.findSpotsByUserId);
app.get('/users', spot.findAllUsers);
app.delete('/user/:userId/delete', spot.deleteUser);
app.post('/user/:userId/spot/:spotId/add', spot.addUserSpot); 
app.post('/user/:userId/spot/:spotId/addSurferOnSpot', spot.addsurferOnSpot); 
app.put('/user/:userId/spot/:spotId/delete', spot.deleteUserSpot); 
app.get('/spots', spot.findAll);
app.get('/spots/:id', spot.findById);
app.post('/spots/create', spot.addSpot);
app.put('/spots/:id/update', spot.updateSpot);
app.delete('/spots/:id/delete', spot.deleteSpot);
 
app.listen(3000);
console.log('port 3000');