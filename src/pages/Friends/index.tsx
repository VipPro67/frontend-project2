import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IUser } from '../../../types';
import { checkJwt } from '../../../utils/auth';
import { fetchFriendsRequest } from '../../api';
import LeftSidebar from '../../components/LeftSidebar';
const API_URL = import.meta.env.VITE_API_URL;

const FriendsPage = () => {
  const [listRelationships, setListRelationships] = useState<any | null>(null);

  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const [view, setView] = useState('listFriends');

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

  const handleUnfriend = async (id: number) => {
    await axios
      .get(`${API_URL}/api/v1/relationships/unfriend/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          alert('Send unfriend request successfully');
        }
      });
  };

  const showlistFriends = () => {
    if (listRelationships) {
      return listRelationships.response.map((relationship: any) => {
        if (
          relationship.user.id != currentUser?.id ||
          relationship.isFriend == false ||
          relationship.status != 'confirmed'
        ) {
          return;
        } else
          return (
            <div className="flex justify-between border rounded m-2 p-2 max ">
              <div className="flex items-center">
                <img
                  className="w-20 h-20 rounded-full"
                  src={relationship.friend.avatar}
                  alt=""
                />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-900">
                    {relationship.friend.first_name}{' '}
                    {relationship.friend.last_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none"
                  onClick={() => handleUnfriend(relationship.friend.id)}
                >
                  Unfriend
                </button>
              </div>
            </div>
          );
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
            <div className="grid grid-cols-7">
              <div className="grid col-span-7 grid-cols-3 ">
                <div className="ml-2 col-span-7">
                  {view == 'listFriends' ? (
                    <div>
                      <p className=" font-bold text-lg">List Friends</p>
                      {showlistFriends()}
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
