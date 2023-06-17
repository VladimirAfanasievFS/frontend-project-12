import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';

import { useDispatch } from 'react-redux';
import ChannelsBox from './ChannelsBox.jsx';
import ChatBox from './ChatBox.jsx';
import { dataPath } from '../routes.js';
import { setInitialState } from '../slices/channels.js';

const ChatPage = () => {
  const [fetching, setFetching] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      const token = JSON.parse(localStorage.getItem('userId'))?.token;
      const res = await axios.get(dataPath(), { headers: `Authorization: Bearer ${token}` });
      const { channels, currentChannelId, messages } = res.data;
      dispatch(setInitialState({ channels, currentChannelId, messages }));

      setFetching(false);
    }
    fetchData();
  }, []);

  return fetching ? (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">loading</span>
      </Spinner>
    </div>
  ) : (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <ChannelsBox />
        </div>
        <div className="col p-0 h-100">
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
