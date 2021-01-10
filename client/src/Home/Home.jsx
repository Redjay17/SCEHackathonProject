import React from "react";
import { Link } from "react-router-dom";

import "./Home.css";

const Home = () => {
  const [username, setUsername] = React.useState("");
  const [roomName, setRoomName] = React.useState("");

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  return (
    <div className="home-container">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={handleUsernameChange}
        className="text-input-field"
      />
      <input
        type="text"
        placeholder="Room"
        value={roomName}
        onChange={handleRoomNameChange}
        className="text-input-field"
      />
      <Link 
        to={{
          pathname:`/${roomName}`,
          state: {
            roomId: roomName,
            username: username
          }
        }}
        className="enter-room-button" 
      >
        Join room
      </Link>
    </div>
  );
};

export default Home;
