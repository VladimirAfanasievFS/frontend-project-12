import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import SocketContext from '../contexts/SocketContext';
import { addMessage } from '../slices/messages';
import {
  addChannel, changeChannel, removeChannel, renameChannel,
} from '../slices/channels';

const withTimeout = (onSuccess, onError, timeout) => {
  // eslint-disable-next-line functional/no-let
  let called = false;

  const timer = setTimeout(() => {
    if (called) return;
    called = true;
    onError(new Error('timeout socketError'));
  }, timeout);

  return (response) => {
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
  const dispatch = useDispatch();

  useEffect(() => {
    const onNewMessage = (message) => {
      dispatch(addMessage({ message }));
    };

    const onNewChannel = (channel) => {
      dispatch(addChannel({ channel }));
      dispatch(changeChannel({ channelId: channel.id }));
    };

    const onRemoveChannel = (channel) => {
      dispatch(removeChannel({ channelId: channel.id }));
      dispatch(changeChannel({ channelId: 1 }));
    };

    const onRenameChannel = (channel) => {
      dispatch(renameChannel({ channelId: channel.id, name: channel.name }));
    };

    socket.on('newMessage', onNewMessage);
    socket.on('newChannel', onNewChannel);
    socket.on('removeChannel', onRemoveChannel);
    socket.on('renameChannel', onRenameChannel);

    return () => {
      socket.off('newMessage', onNewMessage);
      socket.off('newChannel', onNewChannel);
      socket.off('removeChannel', onRemoveChannel);
      socket.off('renameChannel', onRenameChannel);
    };
  }, [dispatch, socket]);

  const socketApiContext = useMemo(() => {
    const emitWithAcknowledgements = ({ message, variables }) => new Promise((resolve, reject) => {
      socket.emit(message, variables, withTimeout(resolve, reject, 5000));
    });

    const api = {
      newMessage: (variables) => emitWithAcknowledgements({ message: 'newMessage', variables }),
      newChannel: (variables) => emitWithAcknowledgements({ message: 'newChannel', variables }),
      removeChannel: (variables) => emitWithAcknowledgements({ message: 'removeChannel', variables }),
      renameChannel: (variables) => emitWithAcknowledgements({ message: 'renameChannel', variables }),
    };
    return { api };
  }, [socket]);
  return <SocketContext.Provider value={socketApiContext}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
