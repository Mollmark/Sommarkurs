var express = require("express");

	spots = require("./routes/spots");

var app = express();

app.get("/spots", spots.findAll);
app.get("/spots/:id", spots.findById);

app.listen(3000);
console.log("port 3000...");