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
  username: {
    type: Sequelize.STRING,
    primaryKey: true
  }
});

Users.sync({force: true});

var Messages = sequelize.define('messages', {
  ID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: Sequelize.STRING,
    references: {
      model: Users,
      key: 'username'
    }
  },
  message: {
    type: Sequelize.STRING
  },
  room: {
    type: Sequelize.STRING
  }
});

Messages.sync({force: true});

