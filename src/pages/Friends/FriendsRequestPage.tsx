import { useEffect, useState } from 'react';
import LeftSidebar from '../../components/LeftSidebar';
import { fetchFriendsRequest } from '../../api';
import { checkJwt } from '../../../utils/auth';
import { IUser } from '../../../types';
import { Link } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const FriendsRequestPage = () => {
  const [listRelationships, setListRelationships] = useState<any | null>(null);

  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const [view, setView] = useState('friendsRequest');

  useEffect(() => {
    const fetchData = async () => {
      const response: any = await fetchFriendsRequest();
      setListRelationships({
        response,
      });
    };

    async function fetchCurrentUser() {
      const response: IUser | null = await checkJwt();
      setCurrentUser(response);
    }

    fetchCurrentUser();
    if (!listRelationships) {
      fetchData();
    }
  }, [listRelationships]);

  const handleAcceptFriend = async (id: number) => {
    await axios
      .get(`${API_URL}/api/v1/relationships/accept-friend/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          alert('Accept friend request successfully');
          window.location.reload();
        }
      });
  };

  const handleDeclineFriend = async (id: number) => {
    await axios
      .get(`${API_URL}/api/v1/relationships/reject-friend/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          alert('Send decline request successfully');
          window.location.reload();
        }
      });
  };

  const showlistFriendsRequest = () => {
    if (listRelationships) {
      return listRelationships.response.map((relationship: any) => {
        if (
          relationship.friend.id == currentUser?.id &&
          relationship.status == 'pending' &&
          relationship.isFriend == true
        ) {
          return (
            <div className="flex justify-between border rounded m-2 p-2 max ">
              <div className="flex items-center">
                <img
                  className="w-20 h-20 rounded-full"
                  src={relationship.user.avatar}
                  alt=""
                />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-900">
                    {relationship.user.first_name} {relationship.user.last_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none"
                  onClick={() => handleAcceptFriend(relationship.user.id)}
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="ml-2 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none"
                  onClick={() => handleDeclineFriend(relationship.id)}
                >
                  Decline
                </button>
              </div>
            </div>
          );
        }
      });
    }
  };

  return (
    <div className="xl:grid xl:grid-cols-12">
      <LeftSidebar />
      <div className=" xl:col-span-10  xl:p-2 xl:rounded-xl  bg-white xl:m-2 ">
        <div className=" gird">
          <Link to="/friends">
            <button
              className={
                view == 'listFriends'
                  ? 'm-2 border-2 rounded-2xl text-center font-bold p-2 underline'
                  : 'm-2 border-2 rounded-2xl text-center font-bold p-2'
              }
              onClick={() => setView('listFriends')}
            >
              List Friends
            </button>
          </Link>
          <Link to="/friends/search">
            <button
              className={
                view == 'searchFriends'
                  ? 'm-2 border-2 rounded-2xl text-center font-bold p-2 underline'
                  : 'm-2 border-2 rounded-2xl text-center font-bold p-2'
              }
              onClick={() => setView('searchFriends')}
            >
              Search Friends
            </button>
          </Link>
          <Link to="/friends/friends-request">
            <button
              className={
                view == 'friendsRequest'
                  ? 'm-2 border-2 rounded-2xl text-center font-bold p-2 underline'
                  : 'm-2 border-2 rounded-2xl text-center font-bold p-2'
              }
              onClick={() => setView('friendsRequest')}
            >
              Friends Request
            </button>
          </Link>

          <Link to="/friends/friends-sent">
            {' '}
            <button
              className={
                view == 'friendsSent'
                  ? 'm-2 border-2 rounded-2xl text-center font-bold p-2 underline'
                  : 'm-2 border-2 rounded-2xl text-center font-bold p-2'
              }
              onClick={() => setView('friendsSent')}
            >
              Friends Sent
            </button>
          </Link>
        </div>
        <div className="items-left">
          <div>
            <div>
              <p className=" font-bold text-lg">Friends Request</p>
              {showlistFriendsRequest()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsRequestPage;
