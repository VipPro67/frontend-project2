import { useEffect, useState } from 'react';
import LeftSidebar from '../../components/LeftSidebar';
import { fetchFriendsRequest } from '../../api';
import { fetchFriendsSearch } from '../../api';
import { checkJwt } from '../../../utils/auth';
import { IUser } from '../../../types';

type IResponse = {
  data: IUser[];
  total: number;
  currentPage: number;
  items_per_page: number;
  totalPage: number;
  nextPage: number | null;
  prePage: number | null;
};

const FriendsPage = () => {
  const [listRelationships, setListRelationships] = useState<any | null>(null); // Use state to handle asynchronous data

  const [currentUser, setCurrentUser] = useState<IUser | null>(null); // Use state to handle asynchronous data

  const [view, setView] = useState('friendsRequest');

  const [searchResult, setSearchResult] = useState<any | null>(null); // Use state to handle asynchronous data

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
  }, []);
  const handleSearch = () => {
    const search = document.getElementById('search') as HTMLInputElement;

    return async () => {
      const response: IResponse = await fetchFriendsSearch(search.value);
      setSearchResult(response.data);
    };
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

  const showListSearch = () => {
    if (searchResult) {
      return searchResult.map((user: any) => {
        return (
          <div className="flex justify-between border rounded m-2">
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded-full"
                src={user.avatar}
                alt=""
              />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-900">
                  {user.first_name} {user.last_name}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none"
              >
                Add Friend
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
      <div className=" xl:col-span-7 xl:p-2 xl:rounded-xl  bg-white xl:m-2 ">
        <div className="items-left">
          <div>
            <div>
              <div className="">
                <p className="text-lg mx-2 font-bold">Find Friend</p>
              </div>
              <div className="flex justify-between">
                <label className="m-2 w-[80%] h-12 ">
                  <input
                    id="search"
                    type="search"
                    className="h-9 px-2 text-lg w-full border-2 border-slate-950"
                    placeholder="Search by name"
                  ></input>
                </label>
                <button onClick={handleSearch()}>
                  <img
                    src="../../assets/icons/search.svg"
                    height={32}
                    width={32}
                    alt="search"
                    className="mx-2"
                  />
                </button>
              </div>
              {showListSearch()}
            </div>
            <div className="grid grid-cols-7">
              <div className="grid col-span-7 grid-cols-3 ">
                <button
                  className={
                    view == 'friendsRequest'
                      ? 'm-2 border-2 rounded-2xl text-center font-bold text-white bg-slate-700 underline'
                      : 'm-2 border-2 rounded-2xl text-center font-bold text-white bg-slate-700'
                  }
                  onClick={() => setView('friendsRequest')}
                >
                  Friends Request
                </button>
                <button
                  className={
                    view == 'listFriends'
                      ? 'm-2 border-2 rounded-2xl text-center font-bold text-white bg-slate-700 underline'
                      : 'm-2 border-2 rounded-2xl text-center font-bold text-white bg-slate-700'
                  }
                  onClick={() => setView('listFriends')}
                >
                  List Friends
                </button>
                <button
                  className={
                    view == 'friendsSent'
                      ? 'm-2 border-2 rounded-2xl text-center font-bold text-white bg-slate-700 underline'
                      : 'm-2 border-2 rounded-2xl text-center font-bold text-white bg-slate-700'
                  }
                  onClick={() => setView('friendsSent')}
                >
                  Friends Sent
                </button>
                <div className="ml-2 col-span-7">
                  <p className="text-sm font-medium text-gray-900"></p>
                  {view == 'friendsRequest' ? (
                    <div>
                      <p className=" font-bold text-lg">Friends Request</p>
                      {showlistFriendsRequest()}
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {view == 'listFriends' ? (
                    <div>
                      <p className=" font-bold text-lg">List Friends</p>
                      {showlistFriends()}
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {view == 'friendsSent' ? (
                    <div>
                      <p className=" font-bold text-lg">Friends Sent</p>
                      {showlistFriendsSent()}
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
      <div></div>
    </div>
  );
};

export default FriendsPage;
