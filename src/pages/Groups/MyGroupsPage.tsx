import { useEffect, useState } from 'react';
import LeftSidebar from '../../components/LeftSidebar';

import { Link } from 'react-router-dom';
import { IGroup, IPost, IUser } from '../../../types';
import {
  fetchGroupsSearch,
  fetchMyGroups,
  fetchPostsByUserGroups,
} from '../../api';
import Post from '../../components/Post';
import axios from 'axios';
import { checkJwt } from '../../../utils/auth';

type IResponse = {
  data: IGroup[];
  total: number;
  currentPage: number;
  items_per_page: number;
  totalPage: number;
  nextPage: number | null;
  prePage: number | null;
};

const MyGroupsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createGroupName, setCreateGroupName] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [searchResult, setSearchResult] = useState<IGroup[] | null>(null);
  const [listGroups, setListGroups] = useState<IGroup[] | null>(null);
  const [listPostsInMyGroups, setListPostsInMyGroups] = useState<
    IPost[] | null
  >(null);
  const [view, setView] = useState('listGroups');
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    window.location.href = '/sign-in';
  }
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      const response: IUser | null = await checkJwt();
      setCurrentUser(response);
    }

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      const response: IResponse = await fetchGroupsSearch('');
      setListGroups(response.data);
    };
    fetchGroups();

    const fetchMyGroup = async () => {
      const response = await fetchMyGroups();
      setListGroups(response);
    };
    fetchMyGroup();

    const fetchPostsInMyGroups = async () => {
      const response = await fetchPostsByUserGroups();
      setListPostsInMyGroups(response);
    };
    fetchPostsInMyGroups();
  }, []);

  const handlerSubmit = () => {
    const formData = new FormData();
    formData.append('name', createGroupName);
    formData.append('avatar', selectedMedia || '');

    axios
      .post('http://localhost:3001/api/v1/groups', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((_data) => {
        setIsModalOpen(false);
        setCreateGroupName('');
        setSelectedMedia(null);
      })
      .catch((err) => console.error('Error submitting group:', err));
  };
  const handleSearch = async () => {
    const search = document.getElementById('search') as HTMLInputElement;
    const response: IResponse = await fetchGroupsSearch(search.value);
    setSearchResult(response.data);
  };
  const showListSearch = () => {
    if (searchResult) {
      return searchResult.map((group: IGroup) => {
        return (
          <div className="flex justify-between border rounded m-2">
            <div className="flex items-center">
              <Link to={`/profile/${group.id}`}>
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
            <div className="flex items-center">
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none"
              >
                Join group
              </button>
            </div>
          </div>
        );
      });
    }
  };
  const createGroup = () => {
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 transition-opacity"
            aria-hidden="true"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div
            className="  xl:p-4 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <h1 className="text-2xl font-bold">Add New Group</h1>
            <div className="grid">
              <img
                className="mx-auto border rounded-full w-24 h-24"
                height={100}
                width={100}
                src={
                  selectedMedia
                    ? URL.createObjectURL(selectedMedia)
                    : 'https://via.placeholder.com/100'
                }
                alt="Group Image"
              />
              <p className="text-center text-2xl font-bold">
                {createGroupName || 'Group Name'}
              </p>
            </div>
            <form className="w-full max-w-lg">
              <div className="grid mx-3 mb-6">
                <div className="w-full px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="pet-name"
                  >
                    Name
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="pet-name"
                    type="text"
                    placeholder="Buddy"
                    onChange={(e) => setCreateGroupName(e.target.value)}
                  />
                </div>

                <div className="w-full px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="pet-image"
                  >
                    Image
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="pet-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setSelectedMedia(e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>
            </form>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none  sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => handlerSubmit()}
              >
                Add
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-50 text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none  sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const showListMyGroups = () => {
    if (listGroups) {
      return listGroups.map((group: IGroup) => {
        return (
          <div className="flex justify-between border rounded m-2 p-2 shadow">
            <div className="grid">
              <Link to={`/groups/${group.id}`} className="mx-auto">
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
              </div>
            </div>
          </div>
        );
      });
    }
  };
  const showListPostsInMyGroups = () => {
    if (listPostsInMyGroups) {
      return listPostsInMyGroups.map((post: IPost) => {
        return (
          <div>
            <p className="text-lg mx-2 font-bold">Posts</p>
            <Post key={post.id} {...post} />
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
                    <img
                      src="https://project2-media.s3.ap-southeast-1.amazonaws.com/assets/icons/search.svg"
                      height={32}
                      width={32}
                      alt="search"
                      className="mx-2"
                    />
                  </button>
                </div>
                {showListSearch()}
              </div>
            </div>
          </p>
        ) : null}
        {view == 'listGroups' ? (
          <div className="grid">
            <div className="flex justify-between items-center p-2">
              <div className="flex items-center">
                <h1 className="text-lg font-bold">My Groups</h1>
              </div>
              <div className="flex items-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  onClick={() => setIsModalOpen(true)}
                >
                  Create Group
                </button>
                {isModalOpen && createGroup()}
              </div>
            </div>
            <div className="flex">{showListMyGroups()}</div>
            {showListPostsInMyGroups()}
          </div>
        ) : null}
      </div>
      <div></div>
    </div>
  );
};

export default MyGroupsPage;
