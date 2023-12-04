import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { checkJwt } from '../../../utils/auth';
import { IUser } from '../../../types';

const LeftSidebar = () => {
  const [user, setUser] = useState<IUser | null>(null);

  //check if user in cookie
  useEffect(() => {
    const cookie = document.cookie;
    if (cookie) {
      const userCookie = JSON.parse(
        cookie
          .split('; ')
          .find((row) => row.startsWith('user='))
          ?.split('=')[1] || '{}'
      );
      setUser(userCookie);
    } else {
      console.log('no cookie');
      const fetchUser = async () => {
        const userData = await checkJwt();
        setUser(userData);
        //save user data to cookie
        document.cookie = `user=${JSON.stringify(
          userData
        )}; path=/; max-age=3600`;
      };
      fetchUser();
    }
  }, []);
  return (
    <div className="hidden xl:block xl:col-span-2  to-purple-900 via-indigo-800 from-indigo-500 bg-gradient-to-b">
      <div className=" sticky top-[3rem] flex flex-col bg-clip-border text-gray-700  h-[calc(100vh-3rem)] max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
        <nav className="flex flex-col gap-1 p-2 font-sans text-base  text-gray-700 dark:text-white font-bold">
          <NavLink
            to="/create-post"
            className={({ isActive }) =>
              isActive
                ? 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline'
                : 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none'
            }
          >
            <img
              src="./assets/icons/add-post.svg"
              height={32}
              width={32}
              alt="Create Post"
              className="mr-3"
            />
            Create Post
          </NavLink>
          <NavLink
            to="/new-feed"
            className={({ isActive }) =>
              isActive
                ? 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline'
                : 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none'
            }
          >
            <img
              src="./assets/icons/new-feed.svg"
              height={32}
              width={32}
              alt="New Feed"
              className="mr-3"
            />
            New Feed
          </NavLink>
          <NavLink
            to="/friends"
            className={({ isActive }) =>
              isActive
                ? 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline'
                : 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none'
            }
          >
            <img
              src="./assets/icons/friend.svg"
              height={32}
              width={32}
              alt="Friends"
              className="mr-3"
            />
            Friends
          </NavLink>

          <NavLink
            to="/pets"
            className={({ isActive }) =>
              isActive
                ? 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline'
                : 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none'
            }
          >
            <img
              src="./assets/icons/pet-house.svg"
              height={32}
              width={32}
              alt="Pets"
              className="mr-3"
            />
            Pet
          </NavLink>
          <NavLink
            to="/groups"
            className={({ isActive }) =>
              isActive
                ? 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline'
                : 'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none'
            }
          >
            <img
              src="./assets/icons/group.svg"
              height={32}
              width={32}
              alt="Groups"
              className="mr-3"
            />
            Groups
          </NavLink>
          <button
            type="button"
            className={
              'flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none'
            }
            onClick={() => {
              localStorage.removeItem('access_token');
              document.cookie = 'user=; path=/; max-age=0';
              window.location.href = '/';
            }}
          >
            <img
              src="./assets/icons/logout.svg"
              height={32}
              width={32}
              alt="Logout"
              className="mr-3"
            />
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
};

export default LeftSidebar;
