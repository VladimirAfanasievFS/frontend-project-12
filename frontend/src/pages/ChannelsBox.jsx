import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import { PlusSquare } from 'react-bootstrap-icons';
import { socket } from '../socket';
import { switchModal } from '../slices/modal';
import { TYPE } from './Modal';

const Channel = ({ channel, isCurrent, handleChoose, handleRemove, handleRename }) => {
  return (
    <li key={channel.id} className="nav-item w-100">
      {channel.removable ? (
        <Dropdown as={ButtonGroup} className="d-flex">
          <Button
            type="button"
            key={channel.id}
            className="w-100 rounded-0 text-start text-truncate"
            // onClick={handleChoose}
            // variant={variant}
          >
            <span className="me-1">#</span>
            {channel.name}
          </Button>
          <Dropdown.Toggle
            split
            className="flex-grow-0"
            // variant={variant}
          >
            <span className="visually-hidden">{'channels.menu'}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
            // onClick={handleRemove(channel.id)}
            >
              {'channels.remove'}
            </Dropdown.Item>
            <Dropdown.Item
            // onClick={handleRename(channel.id)}
            >
              {'channels.rename'}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button
          type="button"
          variant="primary"
          key={channel.id}
          className="w-100 rounded-0 text-start"
          active={isCurrent}
          // onClick={handleChoose}
        >
          <span className="me-1">#</span>
          {channel.name}
        </Button>
      )}
    </li>
  );
};

const ChannelsBox = () => {
  const { channels, currentChannelId } = useSelector(state => state.channels);
  console.log('🚀 ~ file: ChannelsBox.jsx:60 ~ ChannelsBox ~ channels:', channels);
  console.log('🚀 ~ file: ChannelsBox.jsx:60 ~ ChannelsBox ~ currentChannelId:', currentChannelId);

  const dispatch = useDispatch();

  const handleAddChannel = () => {
    dispatch(switchModal({ isVisible: true, type: TYPE.ADD }));
    // socket.emit('newChannel', { id: 6, name: 'new channel', removable: true });
  };
  return (
    <>
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>111</b>
        <Button
          type="button"
          variant="group-vertical"
          className="p-0 text-primary"
          onClick={handleAddChannel}
        >
          <PlusSquare size={20} />
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <ul
        id="channels-box"
        className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      >
        {channels.map(channel => (
          <Channel channel={channel} isCurrent={currentChannelId === channel.id} />
        ))}
      </ul>
    </>
  );
};

export default ChannelsBox;
