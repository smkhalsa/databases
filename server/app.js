var express = require('express');
var mysql = require('mysql');
var db = require('./db');

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

var connection = mysql.createConnection({host: 'localhost', user: 'root', database: 'chat'});

connection.connect();

var handleGet = function(req, res) {
  // console.log("heard get");
  // console.log(req.body);
  connection.query('select * from messages', function(err, rows, fields){
    if(err) {
      console.log("ERROR AT GET", err);
      res.json({"code" : 100, "status" : 'Database connection error'});
      return;
    } else {
      res.json(rows);
    }
  });
};

var handleUserPost = function(req, res) {
  var postContent = req.body;
  console.log(postContent);
  var post = {username: postContent.username};
  connection.query("insert into users SET ?", post, function(err, result) {
      if(err) {
        console.log("ERROR AFTER POST", err);
        res.json({"code" : 100, "status" : 'Failed to insert post into database'});
        return;
      } else {
        res.json('You posted: ' + 'placeholder');
      }
  });
};

var handleMessagePost = function(req, res) {
  var postContent = req.body;
  console.log(postContent);
  var post = {message: postContent.message, createdAt: new Date(), roomname: postContent.roomname};
  connection.query("insert into messages SET ?", post, function(err, result) {
      if(err) {
        console.log("ERROR AFTER POST", err);
        res.json({"code" : 100, "status" : 'Failed to insert post into database'});
        return;
      } else {
        res.json('You posted: ' + 'placeholder');
      }
  });
};

app.get("/classes", function(req, res){
  handleGet(req,res);
});

app.post("/classes/users", function(req, res){
  handleUserPost(req,res);
});

app.post("/classes/message", function(req, res){
  console.log("heard post");
  handleMessagePost(req,res);
});

