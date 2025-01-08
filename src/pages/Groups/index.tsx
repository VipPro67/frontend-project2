import { useEffect, useState } from 'react';
import LeftSidebar from '../../components/LeftSidebar';
import { fetchGroupsSearch } from '../../api';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IGroup, IUser } from '../../../types';
import { checkJwt } from '../../../utils/auth';
const API_URL = import.meta.env.VITE_API_URL;

type IResponse = {
  data: IGroup[];
  total: number;
  currentPage: number;
  items_per_page: number;
  totalPage: number;
  nextPage: number | null;
  prePage: number | null;
};

const GroupsPage = () => {
  const [searchResult, setSearchResult] = useState<IGroup[] | null>(null);
  const [view, setView] = useState('searchGroups');
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      const response: IUser | null = await checkJwt();
      setCurrentUser(response);
    }

    fetchCurrentUser();
  }, []);

  const handleSearch = async () => {
    const search = document.getElementById('search') as HTMLInputElement;
    const response: IResponse = await fetchGroupsSearch(search.value);
    setSearchResult(response.data);
  };

  const handleJoinGroup = async (id: string) => {
    try {
      await axios
        .post(
          `${API_URL}/api/v1/groups/${id}/join`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        )
        .then((res) => {
          if (res.status == 201) {
            alert('Join group successfully');
            window.location.href = `/groups/${id}`;
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const showListSearch = () => {
    if (searchResult) {
      return searchResult.map((group: IGroup) => {
        return (
          <div className="flex justify-between border rounded m-2">
            <div className="flex items-center">
              <Link to={`/groups/${group.id}`}>
                <img
                  className="w-20 h-20 rounded-full"
                  src={
                    group.avatar && group.avatar != 'null'
                      ? group.avatar
                      : 'https://via.placeholder.com/100'
                  }
                  alt=""
                />
              </Link>
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-900">
                  {group.name}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {group.users?.length || 0} members
                </p>
              </div>
            </div>
            <div className="flex items-center mr-2">
              {group?.users?.find((g) => g.id == currentUser?.id) ? (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    window.location.href = `/groups/${group.id}`;
                  }}
                >
                  Go to group
                </button>
              ) : (
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    handleJoinGroup(group.id);
                  }}
                >
                  Join
                </button>
              )}
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
          <Link to="/groups">
            <button
              className={
                view == 'listGroups'
                  ? 'm-2 border-2 rounded-2xl text-center font-bold p-2 underline'
                  : 'm-2 border-2 rounded-2xl text-center font-bold p-2'
              }
              onClick={() => setView('listGroups')}
            >
              List My Groups
            </button>
          </Link>
          <Link to="/groups/search">
            <button
              className={
                view == 'searchGroups'
                  ? 'm-2 border-2 rounded-2xl text-center font-bold p-2 underline'
                  : 'm-2 border-2 rounded-2xl text-center font-bold p-2'
              }
              onClick={() => setView('searchGroups')}
            >
              Search Groups
            </button>
          </Link>
        </div>
        {view == 'searchGroups' ? (
          <p>
            <div>
              <div>
                <div className="">
                  <p className="text-lg mx-2 font-bold">Find Group</p>
                </div>
                <div className="flex justify-between">
                  <label className="m-2 w-[80%] h-12 ">
                    <input
                      id="search"
                      type="search"
                      className="h-9 px-2 text-lg w-full border-2 border-slate-950"
                      placeholder="Search by group name"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                    ></input>
                  </label>
                  <button onClick={handleSearch}>
                    <svg
                      className="w-6 h-6 transform-rotate-45 mb-2 mr-4 "
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
                          d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                          stroke="#000000"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{' '}
                      </g>
                    </svg>
                  </button>
                </div>
                {showListSearch()}
              </div>
            </div>
          </p>
        ) : null}
      </div>
      <div></div>
    </div>
  );
};

export default GroupsPage;
