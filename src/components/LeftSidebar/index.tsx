import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { checkJwt } from '../../../utils/auth';
import { IUser } from '../../../types';

const LeftSidebar = () => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const userData = await checkJwt();
      setUser(userData);
    };
    checkAuth();
  }, []);

  return (
    <div className="sticky top-0 xl:block xl:col-span-2 to-purple-200 via-indigo-200 from-indigo-200 bg-gradient-to-b">
      <div className="sticky top-[3rem] flex flex-col bg-clip-border text-gray-700 xl:h-[calc(100vh-3rem)] xl:max-w-[20rem] xl:p-4 shadow-xl shadow-blue-gray-900/5">
        <nav className="flex flex-row xl:flex-col gap-1 p-1 font-sans text-base text-gray-700 font-bold">
          <NavLink
            to="/create-post"
            className={({ isActive }) =>
              `flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 justify-center xl:justify-start ${
                isActive ? 'outline' : 'outline-none'
              }`
            }
          >
            <svg
              className="w-8 h-8 mr-3"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            <p className="hidden xl:block">Create Post</p>
          </NavLink>
          <NavLink
            to="/new-feed"
            className={({ isActive }) =>
              `flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 justify-center xl:justify-start ${
                isActive ? 'outline' : 'outline-none'
              }`
            }
          >
            <svg
              className="w-8 h-8 mr-3"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z" />
            </svg>
            <p className="hidden xl:block">New Feed</p>
          </NavLink>
          <NavLink
            to="/friends"
            className={({ isActive }) =>
              `flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 justify-center xl:justify-start ${
                isActive ? 'outline' : 'outline-none'
              }`
            }
          >
            <svg
              className="w-8 h-8 mr-3"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            <p className="hidden xl:block">Friends</p>
          </NavLink>
          <NavLink
            to="/pets/my-pets"
            className={({ isActive }) =>
              `flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 justify-center xl:justify-start ${
                isActive ? 'outline' : 'outline-none'
              }`
            }
          >
            <svg
              className="w-8 h-8 mr-3"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.41003 16.75C4.17003 19.64 6.35003 22 9.25003 22H14.04C17.3 22 19.54 19.37 19 16.15C18.43 12.77 15.17 10 11.74 10C8.02003 10 4.72003 13.04 4.41003 16.75Z"
                stroke="#292D32"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10.47 7.5C11.8507 7.5 12.97 6.38071 12.97 5C12.97 3.61929 11.8507 2.5 10.47 2.5C9.08926 2.5 7.96997 3.61929 7.96997 5C7.96997 6.38071 9.08926 7.5 10.47 7.5Z"
                stroke="#292D32"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17.3 8.69995C18.4046 8.69995 19.3 7.80452 19.3 6.69995C19.3 5.59538 18.4046 4.69995 17.3 4.69995C16.1955 4.69995 15.3 5.59538 15.3 6.69995C15.3 7.80452 16.1955 8.69995 17.3 8.69995Z"
                stroke="#292D32"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M21 12.7C21.8284 12.7 22.5 12.0284 22.5 11.2C22.5 10.3715 21.8284 9.69995 21 9.69995C20.1716 9.69995 19.5 10.3715 19.5 11.2C19.5 12.0284 20.1716 12.7 21 12.7Z"
                stroke="#292D32"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3.96997 10.7C5.07454 10.7 5.96997 9.80452 5.96997 8.69995C5.96997 7.59538 5.07454 6.69995 3.96997 6.69995C2.8654 6.69995 1.96997 7.59538 1.96997 8.69995C1.96997 9.80452 2.8654 10.7 3.96997 10.7Z"
                stroke="#292D32"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p className="hidden xl:block">Pet</p>
          </NavLink>
          <NavLink
            to="/groups"
            className={({ isActive }) =>
              `flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 justify-center xl:justify-start ${
                isActive ? 'outline' : 'outline-none'
              }`
            }
          >
            <svg
              className="w-8 h-8 mr-3"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85-.85-.37-1.79-.58-2.78-.58-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
            </svg>
            <p className="hidden xl:block">Groups</p>
          </NavLink>
          {user && (
            <button
              type="button"
              className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 justify-center xl:justify-start outline-none"
              onClick={() => {
                if (confirm('Are you sure you want to logout?')) {
                  localStorage.removeItem('access_token');
                  document.cookie = 'user=; path=/; max-age=0';
                  window.location.href = '/';
                }
              }}
            >
              <svg
                className="w-8 h-8 mr-3"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
              <p className="hidden xl:block">Logout</p>
            </button>
          )}
        </nav>
      </div>
    </div>
  );
};

export default LeftSidebar;
