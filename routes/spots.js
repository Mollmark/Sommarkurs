surfspots.findAll = function(req, res) {
    res.send([{name:'Hagapark'}, {name:'Sandbergen'}, {name:'Dogshit beach'}]);
};

surfspots.findById = function(req, res) {
    res.send({id:req.params.id, name: "spotname", description: "spotdescription"});
};