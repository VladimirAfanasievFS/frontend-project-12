import { useEffect, useState } from 'react';
import SocketContext from '../contexts/SocketContext';
import { socket } from '../socket';
import { useDispatch } from 'react-redux';
import { addMessage } from '../slices/messages';

const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  // const [fooEvents, setFooEvents] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onNewMessage(message) {
      dispatch(addMessage({ message }));
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('newMessage', onNewMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('newMessage', onNewMessage);
    };
  }, [dispatch]);

  return <SocketContext.Provider value={{ isConnected }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
