import { useEffect, useState } from 'react';
import LeftSidebar from '../../components/LeftSidebar';

import { Link } from 'react-router-dom';
import { IGroup } from '../../../types';
import { fetchGroupsSearch } from '../../api';

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
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    window.location.href = '/sign-in';
  }

  useEffect(() => {}, []);

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
            </div>
          </p>
        ) : null}
      </div>
      <div></div>
    </div>
  );
};

export default GroupsPage;
