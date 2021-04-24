import {useEffect, useState} from "react";
import socketIOClient, {Socket} from 'socket.io-client';
import {Token} from '../types';

type SocketType = typeof Socket;
export default function useSocket(): [SocketType | null, boolean, string | null] {
  const [socket, setSocket] = useState<SocketType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  useEffect((): any => {
    const token = localStorage.getItem(Token.jwt);
    // send token on init request
    const io = socketIOClient(process.env.REACT_APP_SOCKET_ENDPOINT || '/', {
      query: `token=${token}`,
      autoConnect: true,
      secure: true,
    });
    setSocket(io);
    io.on('error', (message: string) => setError(message));
    io.on('connect', (message: string) => setConnected(io.connected));

    // Clean up
    return () => io.close();
  }, []);

  return [socket, connected, error];
};
