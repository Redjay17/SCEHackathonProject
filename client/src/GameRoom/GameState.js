import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const GAME_STATE_UPDATED = "gameStateUpdated";
const CONNECT_FAILED = "connectFailed";
const PLAYER_READY_EVENT = "playerReadyEvent";
const GAME_START_EVENT = "gameStartEvent";

const SOCKET_SERVER_URL = "http://localhost:4000";

const useGameState = (roomId, username, setHand) => {
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
      setGameState(obj)
      setHand(obj["players"][username]["hand"]);
    });

    socketRef.current.on(CONNECT_FAILED, () => {
      setValidPlayer(false);
    });

    socketRef.current.on(GAME_STATE_UPDATED, (newGameState) => {
      setGameState(newGameState);
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

  const updateGameState = (gameAction) => {
    socketRef.current.emit(GAME_STATE_UPDATED, {
      body: gameAction,
      senderId: socketRef.current.id,
    });
  };

  const readyPlayer = () => {
    setReady(true);
    socketRef.current.emit(PLAYER_READY_EVENT, {
      body: username
    });

    console.log("I am ready!");
  }

  return { gameState, updateGameState, messages, sendMessage, validPlayer, ready, readyPlayer};
};

export default useGameState;