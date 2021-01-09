import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SOCKET_SERVER_URL = "http://localhost:4000";

const useGameState = (roomId, username) => {
  const [gameState, setGameState] = useState(undefined);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId: roomId, username: username },
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      setGameState(gameState);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, username]);

  const updateGameState = (gameAction) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: gameAction,
      senderId: socketRef.current.id,
    });
  };

  return { gameState, updateGameState };
};

export default useGameState;