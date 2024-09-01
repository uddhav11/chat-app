const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
const cors = require("cors");
const chatRoutes = require("./routes/chatRoutes");
const path= require('path')

const PORT = process.env.PORT || 4000;
const app = express();

// middlewares
app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


// ----------Deployment code --------------------------------------

const __dirname1= path.resolve(__dirname, "..");
console.log(__dirname1)

if(process.env.NODE_ENV === 'production'){

  app.use(express.static(path.join(__dirname1, "frontend/build")))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend" ,"build", "index.html"))
  })


} else{
  app.get("/", (req, res) => {
    res.send('API is Running successfully')
  })
}

// ----------Deployment code --------------------------------------



app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`listining to the port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: `http://localhost:5173`,
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat users are not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log('user Disconnected')
    socket.leave(userData._id)
  })
});
