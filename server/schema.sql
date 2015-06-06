CREATE DATABASE chat;

USE chat;

CREATE TABLE users (
  /* Describe your table here.*/
  -- ID int(11) NOT NULL auto_increment,
  username VARCHAR(100),
  PRIMARY KEY (username)
);

CREATE TABLE messages (
  /* Describe your table here.*/
  ID int(11) NOT NULL auto_increment,
  username VARCHAR(100),
  message VARCHAR(100),
  createdAt TIMESTAMP,
  roomname VARCHAR(100),
  PRIMARY KEY (ID)
);

/* Create other tables and define schemas for them here! */

ALTER TABLE messages
ADD CONSTRAINT FK_messages
FOREIGN KEY (username) REFERENCES users(username)
ON UPDATE CASCADE
ON DELETE CASCADE;



/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

-- insert into rooms (name) values ('default');
-- insert into messages (username, message, createdAt, roomname) values ('anon', 'hello world', NOW(), 'default');

-- select * from rooms;
-- select * from messages;
