import React, { useEffect } from 'react';

import NewMessageForm from './NewMessageForm.jsx';
import { useSelector } from 'react-redux';

const Message = ({ username, body }) => (
  <div className="text-break mb-2">
    <b>{username}</b>
    {': '}
    {body}
  </div>
);

const ChatBox = () => {
  const messages = useSelector(state =>
    state.messages.messages.filter(message => {
      return message.channelId === state.channels.currentChannelId;
    }),
  );

  //cкролл вниз react-scroll
  return (
    <div className="d-flex flex-column h-100">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b>name</b>
        </p>
        <span className="text-muted">message count</span>
      </div>
      <div id="messages-box" className="chat-messages overflow-auto px-5 ">
        {messages.map(message => (
          <Message username={'username'} body={message.body} key={message.id} />
        ))}
      </div>
      <div className="mt-auto px-5 py-3">
        <NewMessageForm />
      </div>
    </div>
  );
};

export default ChatBox;
