import React from "react";
import { Redirect } from "react-router-dom";

import useGameState from "./GameState";
import ChatRoom from "../ChatRoom/ChatRoom";
import PlayerField from "../Components/PlayerField";

import "./GameRoom.css";

const handleCardsPlayed = (field, stack, currHand, updateGameState) => {
  // Instant win conditions

  // Standard checking
  if (stack.length > 0 
    && field.length !== stack.length) 
  {
    return;
  }

  // If everything is good, update game state

  updateGameState(field, currHand);
};

const nullState = {
  roomId: "",
  username: "",
};

const GameRoom = (props) => {
  const { roomId, username } = props.location.state !== undefined ? props.location.state : nullState;
  const [hand, setHand] = React.useState([]);
  const [field, setField] = React.useState([]);
  const [isTurn, setIsTurn] = React.useState(false);
  const [curPlayer, setCurPlayer] = React.useState("n/a");
  const [stack, setStack] = React.useState([]);
  const [newGameAction, setNewGameAction] = React.useState(undefined);
  const {
    gameState,
    updateGameState,
    messages,
    sendMessage,
    validPlayer,
    ready,
    readyPlayer,
    skipPlayer,
  } = useGameState(roomId, username, setHand, setIsTurn, setCurPlayer, setStack, setField);

  if (!validPlayer) {
    return <Redirect push to="/" />;
  }

  return (
    <div className="chat-room-container">
      <h1 className="room-name">Room: {roomId}</h1>
      {gameState === undefined?  
      <h3 className="room-name">Joined as: {username}</h3>:
      <h3 className="room-name">Joined as: {username}; Current turn: {curPlayer}</h3>}
      <div className="stack-container">
        {stack.map((item, indx) =>
            <img src={"/Images/" + item.filepath} alt={item.id} className="card" />
        )}
      </div>

      <div>
        <button
          className="button"
          disabled={ready}
          onClick={() => {
            readyPlayer();
          }}
        >
          Ready for Game
        </button>

        <button
          className="button"
          disabled={field.length === 0}
          onClick={() => {
            handleCardsPlayed(field, stack, hand, updateGameState);
          }}
        >
          {" "}
          Confirm Selected Cards{" "}
        </button>

        <button
          className="button"
          disabled={!isTurn}
          onClick={() => {
            skipPlayer();
          }}
        >
          Skip your turn
        </button>
      </div>

      <PlayerField
        hand={hand}
        field={field}
        setHand={setHand}
        setField={setField}
        canPlay={isTurn}
      />
      <ChatRoom
        roomId={roomId}
        messages={messages}
        sendMessage={sendMessage}
        updateGameState={updateGameState}
      />
    </div>
  );
};

export default GameRoom;
