const express = require("express");
const PORT = process.env.PORT || 3001;
const path = require('path');
const mongoose = require("mongoose");
const Router = require("./routes")
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
mongoose.connect(
  `mongodb+srv://restapi:apple123@cluster0.u67azox.mongodb.net/?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(Router);

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const io = new Server(server, {
    cors: {
      
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });
  
    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
      console.log(data);
    });
  
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });


server.listen(PORT, () => {
    console.log("SERVER RUNNING");
  });