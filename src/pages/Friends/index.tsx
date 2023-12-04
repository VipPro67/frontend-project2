import { useEffect, useState } from 'react';
import LeftSidebar from '../../components/LeftSidebar';
import { fetchFriendsRequest } from '../../api';
import { checkJwt } from '../../../utils/auth';
import { IUser } from '../../../types';

const FriendsPage = () => {
  const [listRelationships, setListRelationships] = useState<any | null>(null); // Use state to handle asynchronous data

  const [currentUser, setCurrentUser] = useState<IUser | null>(null); // Use state to handle asynchronous data

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
    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once

  const showlistFriendsRequest = () => {
    if (listRelationships) {
      return listRelationships.response.map((relationship: any) => {
        if (
          relationship.friend.id == currentUser?.id &&
          relationship.status == 'pending' &&
          relationship.isFriend == true
        ) {
          return (
            <div className="flex justify-between border rounded m-2">
              <div className="flex items-center">
                <img
                  className="w-10 h-10 rounded-full"
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
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="ml-2 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none"
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
            <div className="flex justify-between border rounded m-2">
              <div className="flex items-center">
                <img
                  className="w-10 h-10 rounded-full"
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
                >
                  Unfriend
                </button>
              </div>
            </div>
          );
      });
    }
  };

  const showlistFriendsSent = () => {
    if (listRelationships) {
      return listRelationships.response.map((relationship: any) => {
        if (
          relationship.user.id != currentUser?.id ||
          relationship.isFriend != true ||
          relationship.status != 'pending'
        ) {
          return;
        } else
          return (
            <div className="flex justify-between border rounded m-2">
              <div className="flex items-center">
                <img
                  className="w-10 h-10 rounded-full"
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
                >
                  Cancel
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
      <div className=" xl:col-span-7 xl:p-2 xl:rounded-xl bg-white xl:m-2">
        <div className="items-left">
          <div>
            <h1 className="text-2xl font-bold">Friends Request</h1>
            <div className="mt-4">{showlistFriendsRequest()}</div>

            <h1 className="text-2xl font-bold">List Friends</h1>
            <div className="mt-4">{showlistFriends()}</div>

            <h1 className="text-2xl font-bold">Friends Sent</h1>
            <div className="mt-4">{showlistFriendsSent()}</div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default FriendsPage;
