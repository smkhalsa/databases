var db = require('../db');

db.connection.connect();

module.exports = {
  messages: {
    get: function (req, res) {
      db.connection.query('select * from messages', function(err, rows, fields){
        if(err) {
          console.log("ERROR AT GET", err);
          res.json({"code" : 100, "status" : 'Database connection error'});
          return;
        } else {
          res.json(rows);
        }
      });
    }, // a function which produces all the messages
    post: function (req, res) {
      var postContent = req.body;
      var post = {username: postContent.username, message: postContent.message, createdAt: new Date(), roomname: postContent.roomname};
      var hasUsername = false;
      db.connection.query("select * from users", function(err,rows, fields) {
        if(!err) {
          for(var i = 0; i < rows.length; i++) {
            if(rows[i].username.toLowerCase() === postContent.username.toLowerCase()) {
              hasUsername = true;
            }
          }
        }
        if(!hasUsername) {
          var userName = {username: postContent.username};
          db.connection.query("insert into users SET ?", userName, function(err, result) {
            if(err) {
              console.log("ERROR AFTER POST", err);
              res.json({"code" : 100, "status" : 'Failed to insert post into database'});
              return;
            }
            db.connection.query("insert into messages SET ?", post, function(err, result) {
                if(err) {
                  console.log("ERROR AFTER POST", err);
                  res.json({"code" : 100, "status" : 'Failed to insert post into database'});
                  return;
                } else {
                  // res.sendStatus(201)
                  res.json(post);
                }
            });
          });
        } else {
          db.connection.query("insert into messages SET ?", post, function(err, result) {
              if(err) {
                console.log("ERROR AFTER POST", err);
                res.json({"code" : 100, "status" : 'Failed to insert post into database'});
                return;
              } else {
                res.json(result);
              }
          });
        }
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (req, res) {
      db.connection.query('select * from users', function(err, rows, fields){
        if(err) {
          console.log("ERROR AT GET", err);
          res.json({"code" : 100, "status" : 'Database connection error'});
          return;
        } else {
          res.json(rows);
        }
      });
    },
    post: function (req, res) {
      var postContent = req.body;
      var post = {username: postContent.username};
      db.connection.query("insert into users SET ?", post, function(err, result) {
          if(err) {
            res.json({"code" : 100, "status" : 'Failed to insert post into database'});
            return;
          } else {
            res.json(result);
          }
      });
    }
  }
};

