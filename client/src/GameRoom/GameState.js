import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const GAME_STATE_UPDATED = "gameStateUpdated";
const CONNECT_FAILED = "connectFailed";
const PLAYER_READY_EVENT = "playerReadyEvent";
const GAME_START_EVENT = "gameStartEvent";
const PLAYER_SKIP_EVENT = "playerSkipEvent"
const ROUND_UPDATE_EVENT = "roundUpdateEvent"

const SOCKET_SERVER_URL = "http://localhost:4000";

const useGameState = (roomId, username, setHand, setIsTurn, setCurPlayer, setStack, setField) => {
  const [gameState, setGameState] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [validPlayer, setValidPlayer] = useState(true);
  const [ready, setReady] = useState(false);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId: roomId, username: username },
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };

      console.log(incomingMessage);

      setMessages((messages) => [...messages, incomingMessage]);
    });

    socketRef.current.on(GAME_START_EVENT, (gameState) => {
      let obj = JSON.parse(gameState)
      let curTurn = obj["current_turn"]
      console.log(gameState);
      setGameState(obj)
      setHand(obj["players"][username]["hand"]);
      setCurPlayer(obj["player_revserse_dictionary"][curTurn])
      if(obj["player_revserse_dictionary"][curTurn] === username){
        setIsTurn(true)
      } else {
        setIsTurn(false)
      }
    });

    socketRef.current.on(CONNECT_FAILED, () => {
      setValidPlayer(false);
    });

    socketRef.current.on(GAME_STATE_UPDATED, (gameState) => {
      let obj = JSON.parse(gameState)
      let curTurn = obj["current_turn"]
      setGameState(obj)
      setStack(obj["curr_stack"])
      setHand(obj["players"][username]["hand"])
      setField([])
      
      if(obj["player_revserse_dictionary"][curTurn] === username){
        setIsTurn(true)
      } else {
        setIsTurn(false)
      }
    });

    socketRef.current.on(ROUND_UPDATE_EVENT, (gameState) => {
      let obj = JSON.parse(gameState);
      let curTurn = obj["current_turn"]
      console.log(gameState)
      setCurPlayer(obj["player_revserse_dictionary"][curTurn])
      if(obj["player_revserse_dictionary"][curTurn] === username){
        setIsTurn(true)
      } else {
        setIsTurn(false)
      }

      setStack(obj["curr_stack"])
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, username]);

  const sendMessage = (messageBody) => {
    console.log(messageBody);
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
    });
  };

  const updateGameState = (gameAction, hand) => {
    console.log(gameAction)
    console.log(hand)

    socketRef.current.emit(GAME_STATE_UPDATED, {
      newStack: gameAction,
      newHand: hand
    })
  };

  const readyPlayer = () => {
    setReady(true);
    socketRef.current.emit(PLAYER_READY_EVENT, {
      body: username
    });

    console.log("I am ready!");
  }

  const skipPlayer = () => {
    socketRef.current.emit(PLAYER_SKIP_EVENT, {
      body: username
    });
  }

  return { gameState, updateGameState, messages, sendMessage, validPlayer, ready, readyPlayer, skipPlayer};
};

export default useGameState;