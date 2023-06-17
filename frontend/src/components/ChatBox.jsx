import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import find from 'lodash/find';
import { animateScroll } from 'react-scroll';
import NewMessageForm from './NewMessageForm.jsx';

const Message = ({ username, body }) => (
  <div className="text-break mb-2">
    <b>{username}</b>
    {': '}
    {body}
  </div>
);

const ChatBox = () => {
  const messages = useSelector((state) => state.messages.messages.filter(
    (message) => message.channelId === state.channels.currentChannelId,
  ));
  const { t } = useTranslation();

  const { channels, currentChannelId } = useSelector((state) => state.channels);

  const channel = find(channels, ({ id }) => id === currentChannelId);

  useEffect(() => {
    animateScroll.scrollToBottom({ containerId: 'messages-box', delay: 0, duration: 300 });
  }, [messages.length]);

  return (
    <div className="d-flex flex-column h-100">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b>
            #
            {channel?.name}
          </b>
        </p>
        <span className="text-muted">
          {`${messages.length} ${t('chat.messageCount', {
            count: messages.length,
          })}`}
        </span>
      </div>
      <div id="messages-box" className="chat-messages overflow-auto px-5 ">
        {messages.map((message) => (
          <Message username={message.userName} body={message.body} key={message.id} />
        ))}
      </div>
      <div className="mt-auto px-5 py-3">
        <NewMessageForm />
      </div>
    </div>
  );
};

export default ChatBox;
