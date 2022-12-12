import { useState, useEffect } from "react";
import { Socket, io } from "socket.io-client";

const socket: Socket = io(import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://interview-case-api.fly.dev/");

export function useSocket() {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [socketId, setSocketId] = useState<string>(socket.id);

  useEffect(() => {
    socket.on("connect", (): void => {
      setSocketId(socket.id);
      setIsConnected(true);
    });
    socket.on("disconnect", (): void => {
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  function listen<T>(eventName: string, func: (value: T) => void) {
    socket.on(eventName, func);
  }

  function emit(eventName: string, eventValue?: any) {
    if (eventValue) {
      socket.emit(eventName, eventValue);
    } else {
      socket.emit(eventName);
    }
  }

  function off(eventName: string) {
    socket.off(eventName);
  }

  return {
    socketId,
    isConnected,
    listen,
    emit,
    off,
  };
}
