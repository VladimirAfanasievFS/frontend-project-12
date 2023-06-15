import { useEffect, useState } from 'react';
import SocketContext from '../contexts/SocketContext';
import { useDispatch } from 'react-redux';
import { addMessage } from '../slices/messages';
import { addChannel, changeChannel, removeChannel, renameChannel } from '../slices/channels';

const withTimeout = (onSuccess, onError, timeout) => {
  let called = false;

  const timer = setTimeout(() => {
    if (called) return;
    called = true;
    onError(new Error('timeout socketError'));
  }, timeout);

  return response => {
    if (response.status !== 'ok') {
      onError(new Error(response.status));
    }
    if (called) return;
    called = true;
    clearTimeout(timer);
    onSuccess(response);
  };
};

const SocketProvider = ({ children, socket }) => {
  //is connected doesnot use
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
  }, [dispatch, socket]);

  const emitWithAcknowledgements = ({ message, variables }) => {
    return new Promise((resolve, reject) => {
      socket.emit(message, variables, withTimeout(resolve, reject, 5000));
    });
  };

  const api = {
    newMessage: variables => emitWithAcknowledgements({ message: 'newMessage', variables }),
    newChannel: variables => emitWithAcknowledgements({ message: 'newChannel', variables }),
    removeChannel: variables => emitWithAcknowledgements({ message: 'removeChannel', variables }),
    renameChannel: variables => emitWithAcknowledgements({ message: 'renameChannel', variables }),
  };
  return <SocketContext.Provider value={{ isConnected, api }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
