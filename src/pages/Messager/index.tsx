import { useEffect, useState } from 'react';
import LeftSidebar from '../../components/LeftSidebar';
import { Link } from 'react-router-dom';
import { checkJwt } from '../../../utils/auth';
import { fetchAllMyConservation } from '../../api';
import { IMessage } from '../../../types';

const MessagerPage = () => {
  const [listConversation, setListConversation] = useState<IMessage[]>();
  const [currentConversation, setCurrentConversation] = useState<IMessage[]>();
  const [currentUser, setCurrentUser] = useState<any>();
  const [search, setSearch] = useState<string>(window.location.search);
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
    fetchUser();
  }, []);
  useEffect(() => {
    const fetchConversation = async () => {
      //search = ?user=5 or ?group=5
      //type = user or group
      const type = search.split('=')[0].replace('?', '');
      const id = search.split('=')[1];

      const response = await fetch(
        `http://localhost:3001/api/v1/messages/conversation/${type}/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setCurrentConversation(data);
        });
    };
    if (search) {
      fetchConversation();
    }
  }, [search]);

  return (
    <div className="xl:grid xl:grid-cols-12 ">
      <div className=" xl:col-span-4 xl:p-2 xl:rounded-xl bg-white xl:m-2 h-[90vh]">
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
          <div className=" border flex flex-col h-[90vh] ">
            <div className="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
              <div className="flex items-center">
                <div>
                  <img
                    className="h-12 w-12 rounded-full"
                    title={
                      currentConversation?.map((message) => {
                        if (message.group) {
                          return message.group.name;
                        }
                        if (message.sender.id != currentUser?.id) {
                          return (
                            message.sender.first_name +
                            ' ' +
                            message.sender.last_name
                          );
                        } else {
                          return (
                            message.receiver?.first_name +
                            ' ' +
                            message.receiver?.last_name
                          );
                        }
                      })[0]
                    }
                    src={
                      currentConversation?.map((message) => {
                        if (message.group) {
                          return message.group.avatar;
                        }
                        if (message.sender.id != currentUser?.id) {
                          return message.sender.avatar;
                        } else {
                          return message.receiver?.avatar;
                        }
                      })[0]
                    }
                  />
                </div>
                <div className="ml-4">
                  <p className="text-grey-darkest text-lg font-bold ">
                    {
                      currentConversation?.map((message) => {
                        if (message.group) {
                          return message.group.name;
                        }
                        if (message.sender.id != currentUser?.id) {
                          return (
                            message.sender.first_name +
                            ' ' +
                            message.sender.last_name
                          );
                        } else {
                          return (
                            message.receiver?.first_name +
                            ' ' +
                            message.receiver?.last_name
                          );
                        }
                      })[0]
                    }
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

            <div className="flex-1 overflow-auto ">
              {currentConversation?.map((message) => {
                return (
                  <div
                    className={`flex mb-2 ${
                      message.sender.id == currentUser?.id ? 'justify-end' : ''
                    }`}
                    key={message.id}
                  >
                    {message.sender.id != currentUser?.id ? (
                      <div>
                        <img
                          title={
                            currentConversation?.map((message) => {
                              if (message.group) {
                                return message.group.name;
                              }
                              if (message.sender.id != currentUser?.id) {
                                return (
                                  message.sender.first_name +
                                  ' ' +
                                  message.sender.last_name
                                );
                              } else {
                                return (
                                  message.receiver?.first_name +
                                  ' ' +
                                  message.receiver?.last_name
                                );
                              }
                            })[0]
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
                      <p className="text-sm mt-1">{message.content}</p>
                      <p className="text-right text-xs font-thin text-grey-dark mt-1">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-grey-lighter px-4 py-4 flex items-center">
              <div className="flex-1 mx-4">
                <input
                  className="w-full rounded px-2 py-2"
                  type="text"
                  placeholder="Type a message..."
                  id="message"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagerPage;
