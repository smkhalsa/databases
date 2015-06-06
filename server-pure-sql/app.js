var express = require('express');
var mysql = require('mysql');
var db = require('./db');
var models = require('./models');

// Middleware
var morgan = require('morgan');
var parser = require('body-parser');

// Router
var router = require('./routes.js');

var app = express();
module.exports.app = app;

// Set what we are listening on.
app.set("port", 3000);

// Logging and parsing
app.use(morgan('dev'));
app.use(parser.json());

// Set up our routes
app.use("/classes", router);

// Serve the client files
app.use(express.static(__dirname + "/../client"));

// If we are being run directly, run the server.
if (!module.parent) {
  app.listen(app.get("port"));
  console.log("Listening on", app.get("port"));
}

app.get("/classes", function(req, res){
  models.messages.get(req,res);
});

app.post("/classes/users", function(req, res){
  models.users.post(req,res);
});

app.post("/classes/message", function(req, res){
  console.log("heard post");
  models.messages.post(req,res);
});

