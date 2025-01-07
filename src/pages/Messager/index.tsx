import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { checkJwt } from '../../../utils/auth';
import { fetchAllMyConservation } from '../../api';
import { IMessage } from '../../../types';
import io from 'socket.io-client';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const MessagerPage = () => {
  const [listConversation, setListConversation] = useState<IMessage[]>();
  const [currentConversation, setCurrentConversation] = useState<IMessage[]>();
  const [currentUser, setCurrentUser] = useState<any>();
  const [currentGroup, setCurrentGroup] = useState<any>();
  const [currentFriend, setCurrentFriend] = useState<any>();
  const [newMessage, setNewMessage] = useState<IMessage>();
  const [search, setSearch] = useState<string>(window.location.search);
  const socket = useRef<any>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllMyConservation();
      setListConversation(data);
      if (search) {
        const type = search.split('=')[0].replace('?', '');
        const id = search.split('=')[1];

        const response = await fetch(
          `${API_URL}/api/v1/messages/conversation/${type}/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );

        const conversationData = await response.json();
        setCurrentConversation(conversationData);
      }
    };

    // Initial data fetch
    fetchData();

    // Socket event handler
    socket.current = io(`${API_URL}`);
    socket.current.on('newMessage', (data: IMessage) => {
      // Update the conversation list with the new message
      setNewMessage(data);
    });
  }, [search]);

  useEffect(() => {
    const fetchAllConversation = async () => {
      const data = await fetchAllMyConservation();
      setListConversation(data);
    };
    fetchAllConversation();
    const fetchUser = async () => {
      const user = await checkJwt();
      setCurrentUser(user);
    };
    const fetchGroup = async () => {
      const response = await axios.get(
        `${API_URL}/api/v1/groups/${search.split('=')[1]}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      setCurrentGroup(response.data);
    };
    const fetchFriend = async () => {
      const response = await axios.get(
        `${API_URL}/api/v1/users/${search.split('=')[1]}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      setCurrentFriend(response.data);
    };
    if (search) {
      if (search.includes('group')) {
        fetchGroup();
      } else {
        fetchFriend();
      }
    }
    fetchUser();
  }, [newMessage, search]);
  useEffect(() => {
    const fetchConversation = async () => {
      //search = ?user=5 or ?group=5
      //type = user or group
      const type = search.split('=')[0].replace('?', '');
      const id = search.split('=')[1];

      await fetch(`${API_URL}/api/v1/messages/conversation/${type}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCurrentConversation(data);
        });
    };
    if (search) {
      fetchConversation();
    }
  }, [search, newMessage]);

  const handleSend = async () => {
    const message = document.getElementById('message') as HTMLInputElement;
    const search = window.location.search;
    const type = search.split('=')[0].replace('?', '');
    const id = search.split('=')[1];

    socket.current.emit('sendMessage', {
      sender_id: currentUser?.id,
      receiver_id: type == 'user' ? id : null,
      group_id: type == 'group' ? id : null,
      content: message.value,
    });
    message.value = '';
  };

  return (
    <div className="xl:grid xl:grid-cols-12 ">
      <div className=" xl:col-span-4 xl:p-2 xl:rounded-xl bg-white xl:m-2 xl:h-[90vh]">
        <div
          className="inline-block w-full align-top bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-gray-50">
            <div className=" border flex flex-col">
              <div className="py-2 px-2 bg-grey-lightest">
                <input
                  type="text"
                  className="w-full px-2 py-2 text-sm"
                  placeholder="Search or start new chat"
                />
              </div>

              <div className="bg-grey-lighter flex-1 overflow-auto">
                {listConversation?.map((conversation) => {
                  return (
                    <Link
                      to={
                        conversation.group
                          ? `/messager?group=${conversation.group.id}`
                          : conversation.sender.id == currentUser?.id
                          ? `/messager?user=${conversation.receiver?.id}`
                          : `/messager?user=${conversation.sender.id}`
                      }
                      className="flex items-center px-2 py-3 border-b border-grey-light cursor-pointer hover:bg-grey-lightest"
                      key={conversation.id}
                      onClick={() =>
                        setSearch(
                          conversation.group
                            ? `?group=${conversation.group.id}`
                            : conversation.sender.id == currentUser?.id
                            ? `?user=${conversation.receiver?.id}`
                            : `?user=${conversation.sender.id}`
                        )
                      }
                    >
                      {conversation.group ? (
                        <div>
                          <img
                            title="YouFriend"
                            className="h-12 w-12 m-2 rounded-full"
                            src={conversation.group?.avatar ?? ''}
                          />
                        </div>
                      ) : conversation.sender.id == currentUser?.id ? (
                        <div>
                          <img
                            title="YouFriend"
                            className="h-12 w-12 m-2 rounded-full"
                            src={conversation.receiver?.avatar ?? ''}
                          />
                        </div>
                      ) : (
                        <div>
                          <img
                            title="YouFriend"
                            className="h-12 w-12 m-2 rounded-full"
                            src={conversation.sender.avatar ?? ''}
                          />
                        </div>
                      )}
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold truncate">
                            {conversation.group
                              ? conversation.group.name
                              : conversation.sender.id == currentUser?.id
                              ? conversation.receiver?.first_name +
                                ' ' +
                                conversation.receiver?.last_name
                              : conversation.sender.first_name +
                                ' ' +
                                conversation.sender.last_name}
                          </h3>
                          <p className="text-xs text-grey-dark">
                            {new Date(
                              conversation.created_at
                            ).toLocaleTimeString()}
                          </p>
                        </div>
                        <p className="text-sm text-grey-dark truncate">
                          {conversation.content}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" xl:col-span-8 xl:p-2 xl:rounded-xl bg-white xl:m-2 overflow-y-scroll ">
        <div
          className="inline-block w-full align-top bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {
            //check if currentConversation is not null
            currentConversation ? (
              <div className=" border flex flex-col h-[90vh] ">
                <div className="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
                  <div className="flex items-center">
                    <div>
                      <img
                        className="h-12 w-12 rounded-full"
                        title={
                          search.includes('group')
                            ? currentGroup?.name
                            : currentFriend?.first_name +
                              ' ' +
                              currentFriend?.last_name
                        }
                        src={
                          search.includes('group')
                            ? currentGroup?.avatar
                            : currentFriend?.avatar
                        }
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-grey-darkest text-lg font-bold ">
                        {search.includes('group')
                          ? currentGroup?.name
                          : currentFriend?.first_name +
                            ' ' +
                            currentFriend?.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          fill="#263238"
                          fill-opacity=".5"
                          d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          fill="#263238"
                          fill-opacity=".5"
                          d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          fill="#263238"
                          fill-opacity=".6"
                          d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-auto mr-2 ">
                  {currentConversation?.map((message) => {
                    return (
                      <div
                        className={`flex mb-2 ${
                          message.sender.id == currentUser?.id
                            ? 'justify-end'
                            : ''
                        }`}
                        key={message.id}
                      >
                        {message.sender.id != currentUser?.id ? (
                          <div>
                            <img
                              title={
                                message.sender.first_name +
                                ' ' +
                                message.sender.last_name
                              }
                              className="h-12 w-12 m-2 rounded-full"
                              src={
                                message.sender.avatar
                                  ? message.sender.avatar
                                  : './default-avatar.png'
                              }
                            />
                          </div>
                        ) : null}

                        <div
                          className={`rounded py-2 px-3 grid  ${
                            message.sender.id == currentUser?.id
                              ? 'bg-blue-200'
                              : 'bg-slate-200'
                          }`}
                        >
                          <p className="text-sm mt-1 ">{message.content}</p>
                          <p className="text-right text-xs font-thin text-grey-dark mt-1">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-grey-lighter px-4 py-4 flex items-center border border-spacing-2">
                  <div className="flex-1 mx-4">
                    <input
                      className="w-full rounded px-2 py-2"
                      type="text"
                      placeholder="Type a message..."
                      id="message"
                      onKeyDown={(e) => e.key == 'Enter' && handleSend()}
                    />
                  </div>
                  <button title="Send" onClick={() => handleSend()}>
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {' '}
                        <path
                          d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z"
                          stroke="#000000"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{' '}
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-[90vh] flex items-center justify-center">
                <p className="text-2xl text-gray-500">
                  Start a new conversation
                </p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default MessagerPage;
