var mysql = require('mysql');
var Sequelize = require('sequelize');
// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".

// exports.connection = mysql.createConnection({host: 'localhost', user: 'root', database: 'chat'});

var sequelize = new Sequelize('chat', 'root', '', {
  host: "localhost",
  dialect: 'mysql',
  pool:  {
    max: 5,
    min: 0,
    idle: 10000
  }
});

var Users = sequelize.define('users', {
  username: Sequelize.STRING
});

var Messages = sequelize.define('messages', {
  message: Sequelize.STRING,
  roomname: Sequelize.STRING
});

Users.hasMany(Messages);
Messages.belongsTo(Users);

Users.sync();
Messages.sync();

exports.Users = Users;
exports.Messages = Messages;
