import React from "react";
import {Redirect} from "react-router-dom";

import useGameState from "./GameState";
import ChatRoom from "../ChatRoom/ChatRoom";
import PlayerField from "../Components/PlayerField";

import "./GameRoom.css";

const handleCardsPlayed = (field, stack, updateGameState) =>{
  const currentCardSize = stack[stack.length-1];

  // Instant win conditions

  // Standard checking
  if(field.length !== currentCardSize){
    return;
  }

  // If everything is good, update game state

  const gameAction = {
    newStack: field,
  }

  updateGameState(gameAction)
}

const nullState = {
  roomId: "",
  username: ""
}

const GameRoom = (props) => {
  const { roomId, username } = props.location.state !== undefined ? props.location.state : nullState;
  const [ hand, setHand ] = React.useState([]);
  const [ field, setField ] = React.useState([]);
  const [ stack, setStack ] = React.useState([[]]);
  const [ newGameAction, setNewGameAction ] = React.useState(undefined);
  const { gameState, updateGameState, messages, sendMessage, validPlayer, ready, readyPlayer } = useGameState(roomId, username, setHand);

  if(!validPlayer){
   return(
     <Redirect push to="/" />
   )
  }

  return (
    <div className="chat-room-container">
      <h1 className="room-name">Room: {roomId}</h1>
      <h3 className="room-name">Joined as: {username}</h3>
      <div>
        <button className="button" disabled={ready} onClick={()=>{readyPlayer()}}>
          Ready for Game
        </button>

        <button className="button" disabled={field.length === 0} onClick={()=>{handleCardsPlayed(field, stack)}}> Confirm Selected Cards </button>
      </div>

      {stack.map((item, indx) =>(

        
      ))}

      <PlayerField hand={hand} field={field} setHand={setHand} setField={setField} />
      <ChatRoom roomId={roomId} messages={messages} sendMessage={sendMessage} updateGameState={updateGameState} />
    </div>
  );
};

export default GameRoom;