import { useEffect, useState } from 'react'; // Import React and useEffect
import { Link } from 'react-router-dom';
import { IUser } from '../../../types';
import { checkJwt } from '../../../utils/auth';
const API_URL = import.meta.env.VITE_API_URL;

const Header = () => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await checkJwt();
      setUser(userData);
    };

    fetchUser();

    async () => {
      await fetch(`${API_URL}/api/v1/messages/conversations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
    };
  }, []); // Run once when the component mounts

  return (
    <header className=" xl:sticky xl:top-0 z-10 flex items-center px-4 text-xl w-full bg-clip-border rounded-xl bg-gray-100 flex-wrap justify-between md:justify-between mx-auto p-1">
      <Link to="/" className="text-2xl font-bold text-green-900/70">
        #PETMD
      </Link>

      <div className="block gap-2">
        {user ? (
          <Link to="/messager">
            <button className="justify-center md:inline-flex mr-8">
              <svg
                fill="#000000"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1920 1920"
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
                    d="M0 1694.235h1920V226H0v1468.235ZM112.941 376.664V338.94H1807.06v37.723L960 1111.233l-847.059-734.57ZM1807.06 526.198v950.513l-351.134-438.89-88.32 70.475 378.353 472.998H174.042l378.353-472.998-88.32-70.475-351.134 438.89V526.198L960 1260.768l847.059-734.57Z"
                    fill-rule="evenodd"
                  ></path>{' '}
                </g>
              </svg>
            </button>
          </Link>
        ) : null}
        {user ? (
          <Link to={`/profile/${user.id}`}>
            <button className="justify-center md:inline-flex h-12 w-12">
              <img
                src={user?.avatar || './default-avatar.png'}
                alt="Profile"
                height={45}
                width={45}
                className="rounded-full border h-[45px] w-[45px]"
              />
            </button>
          </Link>
        ) : (
          <Link to="/sign-in">
            <button className="border hover:border-indigo-600 bg-indigo-500 text-white px-2 py-1 rounded-lg shadow ring-1 ring-inset ring-gray-300">
              Sign in
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
