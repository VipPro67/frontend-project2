import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { checkJwt } from '../../../utils/auth';
import { IUser } from '../../../types';

const LeftSidebar = () => {
  const [user, setUser] = useState<IUser | null>(null);

  //check if user in cookie
  useEffect(() => {
    const checkAuth = async () => {
      const userData = await checkJwt();
      setUser(userData);
    };
    checkAuth();
  }, []);
  return (
    <div className="sticky top-0 xl:block xl:col-span-2  to-purple-200 via-indigo-200 from-indigo-200 bg-gradient-to-b">
      <div className=" sticky top-[3rem] flex flex-col bg-clip-border text-gray-700  xl:h-[calc(100vh-3rem)] xl:max-w-[20rem] xl:p-4 shadow-xl shadow-blue-gray-900/5">
        <nav className="flex flex-row xl:flex-col gap-1 xl:p-2 font-sans text-base  text-gray-700 font-bold">
          <NavLink
            to="/create-post"
            className={({ isActive }) =>
              isActive
                ? 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 justify-center xl:justify-start outline'
                : 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 justify-center xl:justify-start outline-none'
            }
          >
            <img
              src="../../assets/icons/add-post.svg"
              height={32}
              width={32}
              alt="Create Post"
              className="mr-3"
            />
            <p className="hidden xl:block">Create Post</p>
          </NavLink>
          <NavLink
            to="/new-feed"
            className={({ isActive }) =>
              isActive
                ? 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 justify-center xl:justify-start outline'
                : 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 justify-center xl:justify-start outline-none'
            }
          >
            <img
              src="../../assets/icons/new-feed.svg"
              height={32}
              width={32}
              alt="New Feed"
              className="mr-3"
            />
            <p className="hidden xl:block">New Feed</p>
          </NavLink>
          <NavLink
            to="/friends"
            className={({ isActive }) =>
              isActive
                ? 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 justify-center xl:justify-start outline'
                : 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 justify-center xl:justify-start outline-none'
            }
          >
            <img
              src="../../assets/icons/friend.svg"
              height={32}
              width={32}
              alt="Friends"
              className="mr-3"
            />
            <p className="hidden xl:block">Friends</p>
          </NavLink>

          <NavLink
            to="/pets/my-pets"
            className={({ isActive }) =>
              isActive
                ? 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 justify-center xl:justify-start outline'
                : 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 justify-center xl:justify-start outline-none'
            }
          >
            <img
              src="../../assets/icons/pet-house.svg"
              height={32}
              width={32}
              alt="Pets"
              className="mr-3"
            />
            <p className="hidden xl:block">Pet</p>
          </NavLink>
          <NavLink
            to="/groups"
            className={({ isActive }) =>
              isActive
                ? 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 justify-center xl:justify-start outline'
                : 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 justify-center xl:justify-start outline-none'
            }
          >
            <img
              src="../../assets/icons/group.svg"
              height={32}
              width={32}
              alt="Groups"
              className="mr-3"
            />
            <p className="hidden xl:block">Groups</p>
          </NavLink>
          {user ? (
            <button
              type="button"
              className={
                'hidden xl:flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 justify-center xl:justify-start outline-none'
              }
              onClick={() => {
                localStorage.removeItem('access_token');
                document.cookie = 'user=; path=/; max-age=0';
                window.location.href = '/';
              }}
            >
              <img
                src="../../assets/icons/logout.svg"
                height={32}
                width={32}
                alt="Logout"
                className="mr-3"
              />
              <p className="hidden xl:block">Logout</p>
            </button>
          ) : (
            ''
          )}
        </nav>
      </div>
    </div>
  );
};

export default LeftSidebar;
