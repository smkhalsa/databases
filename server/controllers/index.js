var db = require('../db');
var bluebird = require('bluebird');


module.exports = {
  messages: {
    get: function (req, res) {
      db.Messages.findAll({include: [db.Users]})
        .then(function(results, err){
          console.log(results);
          res.json(results);
        });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      db.Users.findOrCreate({where: {username: req.body.username}})
        .then(function(results, err) {
          if (!err) {
            var post = {
              userId: results[0].dataValues.id,
              message: req.body.message,
              roomname: req.body.roomname
            };
            db.Messages.create(post)
              .then(function(results, err) {
                res.sendStatus(201);
              });
          }
        });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      db.Users.findAll()
        .then(function(results, err){
          if (!err) {
            res.json(results);
          }
        });
    },
    post: function (req, res) {
      var user = {username: req.body.username};
      db.Users.create(user)
        .then(function(results, err){
          res.sendStatus(201);
        });
    }
  }
};

