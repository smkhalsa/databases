// YOUR CODE HERE:

// var message = message || {
//  'username': '<script>$(\'body\').style("font-family", "Comic Sans MS")</script>',
//  'message': '<script>$(\'body\').style("font-family", "Comic Sans MS")</script>',
//  'roomname': '<script>$(\'body\').style("font-family", "Comic Sans MS")</script>'
// };

var sanitize = function(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
};



var app = {
  roomSelected: false,
  currentRoom: 'default',
  server: 'http://127.0.0.1:3000',
  dataObjects: {},
  userFriends: {},

  init: function() {
    app.fetch();
    setInterval(function() {
      app.fetch();
    }, 1000)
  },

  handleSubmit: function(message) {
    app.send(message);
  },

  getNewDataObjects: function(data) {
    var newDataObjects = [];
    var fetchedObjects = data;
    for (var i = 0; i < fetchedObjects.length; i++) {
      var fetchedObjectId = fetchedObjects[i].ID;
      if (!app.dataObjects[fetchedObjectId]) {
        app.dataObjects[fetchedObjectId] = fetchedObjects[i];
        newDataObjects.push(fetchedObjects[i]);
      }
    }
    app.addMessages(newDataObjects);
    app.addRooms(app.getRooms(app.dataObjects));
    app.addUsers(app.getUsers(app.dataObjects));
  },


  clearMessages: function() {
   $("#chats").children().remove();
  },

  addMessage: function(message) {
    if (!app.roomSelected) {
      $("#chats").prepend('<div class="message userId' + sanitize(message.username).replace(' ', '') + '">' +
        '<div class="roomname roomId' + sanitize(message.roomname).replace(' ', '') + '">' + 'Room: ' + sanitize(message.roomname) + '</div>' +
        '<div class="username">' + 'User: ' + sanitize(message.username) + '</div>' +
        '<div class="message">' + 'Message: ' + sanitize(message.message) + '</div><BR>' +
        '</div>');
    }
  },

  addMessages: function(data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].message !== undefined){
        data[i].roomname = data[i].roomname || 'default';
        data[i].username = data[i].username || 'anonymous';
        app.addMessage(data[i]);
      }
    }
  },

  send: function(message) {
    $.ajax({
      url: 'http://127.0.0.1:3000/classes/message',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Message sent');
      },
      error: function(data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function() {
    $.ajax({
      url: 'http://127.0.0.1:3000/classes',
      type: 'GET',
      contentType: 'application/json',
      success: function(data) {
        app.getNewDataObjects(data);
      },
      error: function(data) {
        console.error('chatterbox: Failed to get messages');
      }
    });

  },

  setUser: function(name) {

  },

  addRoom: function(room) {
    $("#roomSelect").append('<div class="roomname roomId'
      + sanitize(room)
      + '">'
      + sanitize(room)
      + '</div>');

  },

  addRooms: function(data) {
    $("#roomSelect *").remove();
    _.each(data, function(value,index){
      app.addRoom(value);
    });
  },

  addUser: function(user) {
    $("#userSelect").append('<div class="username">' + sanitize(user) + '</div>');
  },

  addUsers: function(data) {
    $("#userSelect *").remove();
    _.each(data, function(value,index){
      app.addUser(value);
    });
  },

  getRooms: function(data) {
    var uniqueRooms = [];
    _.each(data, function(value,index){
      if (value.roomname) {
        if (uniqueRooms.indexOf(value.roomname) === -1) {
          uniqueRooms.push(value.roomname);
        }
      }
    });
    return uniqueRooms;
  },

  getUsers: function(data) {
    var uniqueUsers = [];
    _.each(data, function(value,index){
      if (value.username) {
        if (uniqueUsers.indexOf(value.username) === -1) {
          uniqueUsers.push(value.username);
        }
      }
    });
    return uniqueUsers;
  },

  addNewFriend: function(name) {
    if(!app.userFriends[name]) {
      app.userFriends[name] = name;
      app.addFriend(name);
    }
  },

  addFriend: function(name) {
    $("#chats .userId" + sanitize(name).replace(' ', '')).addClass('bold');
    $("#userfriends").append('<div class="friend">' + sanitize(name) + '</div>');
  }

};

app.init();
$(document).on('click', '.username', function(el) {
  // app.addNewFriend($(this).message());

});


$(document).on('click', '.submit', function(event) {
  event.preventDefault();
  var message = {
    roomname: $("#send").children(".userroom").val(),
    username: $("#send").children(".username").val(),
    message: $("#send").children(".usermessage").val()
  };
  console.log(message);
  app.handleSubmit(message);
});

$(document).on('click', '.showAllRooms', function(event) {
  $("#chats .message").show();
  app.roomSelected = false;
});

$(document).on('click', '.roomname', function(event) {
  var classList = $(this).attr('class').split(" ");
  var $currentDivs = $("."+classList[1]);
  $("#chats .message").hide();
  $currentDivs.parents().show();
  app.roomSelected = true;

});

$(document).on('click', '.submitroom', function(event) {
  event.preventDefault();
  var message = {
    roomname: $("#sendroom").children(".userroom").val(),
    username: $("#send").children(".username").val(),
    message: undefined
  };
  console.log(message);
  app.handleSubmit(message);
});
