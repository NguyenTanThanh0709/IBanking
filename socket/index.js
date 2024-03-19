const io = require("socket.io")(8900, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  
  let users = [];
  
  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&  
      users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user.userId !== socketId);
  };
  
  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };

  const checkUser = (userId) => {
    return users.some((user) => user.userId === userId);
};


  
  io.on("connection", (socket) => {
    //when ceonnect
    console.log("a user connected.");
    console.log(users);
  
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
      console.log(users)
    });

    //take userId and socketId from user
    socket.on("removeUser", (userId) => {
        removeUser(userId);
        io.emit("removeUsers", users);
        console.log(users)
    });

    //take userId and socketId from user
    socket.on("getUser", (userId) => {
        getUser(userId);
        io.emit("getUsers", users);
        console.log(users)

      });
  
      socket.on("checkUser", (userId) => {
        const userExists = checkUser(userId);
        socket.emit("userExists", userExists );
        console.log("User exists:", userExists);
    });

    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      io.emit("getUsers", users);
    });
  });