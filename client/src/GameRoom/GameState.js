import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const GAME_STATE_UPDATED = "gameStateUpdated";
const SOCKET_SERVER_URL = "http://localhost:4000";

const useGameState = (roomId, username) => {
  const [gameState, setGameState] = useState(undefined);
  const [messages, setMessages] = useState([]);
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

  return { gameState, updateGameState, messages, sendMessage };
};

export default useGameState;