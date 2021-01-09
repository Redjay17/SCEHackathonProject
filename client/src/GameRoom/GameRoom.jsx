import React from "react";

import "./ChatRoom.css";
import useGameState from "./GameState";
import twoClubs from "../Images/2C.jpg"

const GameRoom = (props) => {
  const { roomId, username } = props.location.state;
  const { messages, sendMessage } = useGameState(roomId, username);
  const [ newGameAction, setNewGameACtion ] = React.useState(undefined);
  const [ cards, setCards ] = React.useState([]);

  return (
    <div className="chat-room-container">
      <h1 className="room-name">Room: {roomId}</h1>
      <h3 className="room-name">Joined as: {username}</h3>

      <button className="send-message-button" onClick={()=>{setCards([...cards, "Test"])}}>
        Send
      </button>
      <div className="hand-container">
        {cards.map(card =>
          <img src={twoClubs} alt="img" className='card'/>
        )}
      </div>
    </div>
  );
};

export default GameRoom;