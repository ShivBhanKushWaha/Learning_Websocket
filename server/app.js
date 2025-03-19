import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const Port = 3000;
const secretKey = "kkk";
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    // all origin
    // origin: "*",
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// middleware

// jab true hoga user tabhi conect hoga
io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, (err) => {
    if (err) return next(err);

    const token = socket.request.cookies.token;

    if (!token) return next(new Error("Authentication failed"));

    const decode = jwt.verify(token, secretKey);
    next();
  });
 
});
app.get("/", (req, res) => {
  res.send("Hellow from server");
});

app.get("/login", (req, res) => {
  const token = jwt.sign({ _id: "ssssssss" }, secretKey);
  res
    .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
    .json({ message: "Login Success" });
});

io.on("connection", (socket) => {
  console.log("User connected");
  console.log("Id", socket.id);
  //   khud ko messg kerega
  //   socket.emit("Welcome", `WElcome to the server ${socket.id}`);
  //   khud ko n krke bakiyo ko karega
  //   socket.broadcast.emit("Welcome", `${socket.id} joined the server `);

  // event kaise bnaya
  socket.on("message", (data) => {
    console.log(data); // Debugging
    // socket.broadcast.emit("receive-message", data); // Dusre clients ko bhejne ke liye
    // socket.to(data.room).emit("receive-message", data.message); // room clients ko bhejne ke liye socket io same
    io.to(data.room).emit("receive-message", data.message); // room clients ko bhejne ke liye
    // io.emit("receive-message", data); // sabko milege khud ko bhi
  });
  // room kaise bnaya
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    console.log(`user joined ${roomName}`);
  });

  // disconeet tabhi kam krege jab return statement hogi frontend me
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
