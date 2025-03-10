import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUsers = [];

const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  // io.emit("firstEvent", "Hello this is a test");

  socket.on("newUser", (username) => {
    console.log("New user connected:", username); // Log when a new user connects
    addNewUser(username, socket.id); // Add the new user to the array
    console.log("Current online users:", onlineUsers); // Log the current online users
  });

  socket.on("sendNotification", ({ senderName, receiverName, type }) => {
    console.log("Notification requested:", senderName, "to", receiverName); // Log the sender and receiver
    const receiver = getUser(receiverName); // Get the receiver from the online users
    console.log("Receiver found:", receiver); // Log the receiver object

    if (receiver) {
      // If the receiver exists, send the notification
      io.to(receiver.socketId).emit("getNotification", {
        senderName,
        type,
      });
    } else {
      // If the receiver does not exist, log an error
      console.error(
        `Receiver ${receiverName} not found. Unable to send notification.`
      );
      // Optionally, emit an error event back to the client
      socket.emit("notificationError", { message: "Receiver not found" });
    }
  });

  socket.on("sendText", ({ senderName, receiverName, text }) => {
    console.log("Notification requested:", senderName, "to", receiverName); // Log the sender and receiver
    const receiver = getUser(receiverName); // Get the receiver from the online users
    console.log("Receiver found:", receiver); // Log the receiver object

    if (receiver) {
      // If the receiver exists, send the notification
      io.to(receiver.socketId).emit("getNotification", {
        senderName,
        text,
      });
    } else {
      // If the receiver does not exist, log an error
      console.error(
        `Receiver ${receiverName} not found. Unable to send notification.`
      );
      // Optionally, emit an error event back to the client
      socket.emit("notificationError", { message: "Receiver not found" });
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(5000);
