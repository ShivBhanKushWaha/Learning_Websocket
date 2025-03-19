import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const App = () => {
  // same url pr pass nhi krna padta
  const socket = useMemo(() => io("http://localhost:3000",{withCredentials:true}), []);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketID, setSocketID] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!socket.connected) {
    //   console.log("Socket is not connected yet!");
    //   return;
    // }
    console.log("Sending message:", message); // Debugging log
    socket.emit("message", { message, room });
    setMessage("");
  };
  console.log(messages);

  const joinRoomHandler = (e) => {
    e.preventDefault()
    socket.emit("join_room", roomName);
    setRoomName('');
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("Welcome", (message) => {
      console.log(message);
    });
    socket.on("receive-message", (data) => {
      console.log("message received -----", data);
      setMessages((prevMessages) => [...prevMessages, data]); // ✅ Correct approach
    });

    socket.on("message", (data) => {
      console.log(data); // Listen for messages
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]); // Add socket as a dependency

  return (
    <Container maxWidth="sm">
      <Box sx={{ height: 400 }} />
      <Typography variant="h4" component="div" gutterBottom>
        welcom to socket io
      </Typography>
      <Typography variant="h6" component="div" gutterBottom>
        {socketID}
      </Typography>
      <form onSubmit={joinRoomHandler}>
        <h5>Join room</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="roomname"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          {" "}
          Join
        </Button>
      </form>
      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          {" "}
          Send
        </Button>
      </form>
      <Stack>
        {messages.length > 0 ? (
          messages.map((m, i) => (
            <Typography key={i} variant="h6" component="div" gutterBottom>
              {/* {m.message ? m.message : JSON.stringify(m)} Fix This Line */}
              {m}
            </Typography>
          ))
        ) : (
          <Typography>No Messages Yet</Typography>
        )}
      </Stack>
    </Container>
  );
};

export default App;
