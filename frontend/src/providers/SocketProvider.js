import { useEffect, useState } from 'react';
import SocketContext from '../contexts/SocketContext';
import { socket } from '../socket';
import { useDispatch } from 'react-redux';
import { addMessage } from '../slices/messages';
import { addChannel, changeChannel, removeChannel, renameChannel } from '../slices/channels';

const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const dispatch = useDispatch();
  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onNewMessage = message => {
      dispatch(addMessage({ message }));
    };

    const onNewChannel = channel => {
      dispatch(addChannel({ channel }));
      dispatch(changeChannel({ channelId: channel.id }));
    };

    const onRemoveChannel = channel => {
      dispatch(removeChannel({ channelId: channel.id }));
      dispatch(changeChannel({ channelId: 1 }));
    };

    const onRenameChannel = channel => {
      dispatch(renameChannel({ channelId: channel.id, name: channel.name }));
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('newMessage', onNewMessage);
    socket.on('newChannel', onNewChannel);
    socket.on('removeChannel', onRemoveChannel);
    socket.on('renameChannel', onRenameChannel);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('newMessage', onNewMessage);
      socket.off('newChannel', onNewChannel);
      socket.off('removeChannel', onRemoveChannel);
      socket.off('renameChannel', onRenameChannel);
    };
  }, [dispatch]);

  return <SocketContext.Provider value={{ isConnected }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
