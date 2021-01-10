import React from "react";
import useGameState from "./GameState";
import ChatRoom from "../ChatRoom/ChatRoom";
import PlayerField from "../Components/PlayerField";

import "./GameRoom.css";

const handleCardsPlayed = (field, stack, updateGameState) =>{
  const currentCardSize = stack[stack.length-1];

  if(field.length !== currentCardSize){
    return;
  }


}

const GameRoom = (props) => {
  const { roomId, username } = props.location.state;
  const [ hand, setHand ] = React.useState([]);
  const [ field, setField ] = React.useState([]);
  const [ count, setCount ] = React.useState(2);
  const [ stack, setStack ] = React.useState([[]]);
  const [ newGameAction, setNewGameAction ] = React.useState(undefined);
  const { gameState, updateGameState, messages, sendMessage } = useGameState(roomId, username);

  return (
    <div className="chat-room-container">
      <h1 className="room-name">Room: {roomId}</h1>
      <h3 className="room-name">Joined as: {username}</h3>
      <div>
        <button className="send-message-button" onClick={()=>{
        setHand([...hand, {
          id: `${count}H`,
          content: `item`,
          path: `../Images/${count}C.jpg`,
        }]); 
        
        setField([...field, {
          id: `${count}C`,
          content: `item`,
          path: `../Images/${count}H.jpg`,
        }]); 

        setStack([...field, 
          [{
          id: `${count}C`,
          content: `item`,
          path: `../Images/${count}H.jpg`,
        }]]); 
        
        setCount(count + 1);
        
        }}>
          Send
        </button>

        <button className="button" disabled={field.length === 0} onClick={()=>{handleCardsPlayed(field, stack)}}> Confirm Selected Cards </button>
      </div>

      <PlayerField hand={hand} field={field} setHand={setHand} setField={setField} />
      <ChatRoom roomId={roomId} messages={messages} sendMessage={sendMessage} updateGameState={updateGameState} />
    </div>
  );
};

export default GameRoom;