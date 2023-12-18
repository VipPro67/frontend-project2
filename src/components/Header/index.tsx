import { useState, useEffect } from 'react'; // Import React and useEffect
import { Link } from 'react-router-dom';
import { IUser } from '../../../types';
import { checkJwt } from '../../../utils/auth';
// Assume you have a JWT stored in localStorage

const Header = () => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await checkJwt();
      setUser(userData);
    };

    fetchUser();
  }, []); // Run once when the component mounts

  return (
    <header className=" xl:sticky xl:top-0 z-10 flex items-center px-4 text-xl w-full bg-clip-border rounded-xl md:h-[3rem] bg-gray-100 flex-wrap justify-between md:justify-between mx-auto p-1">
      <Link to="/" className="text-2xl font-bold text-green-900/70">
        #PETMD
      </Link>
      <div className="w-fit md:block md:w-auto">
        <ul className="text-base flex flex-row p-4 space-y-2 md:p-0 space-x-4">
          {/* ... */}
        </ul>
      </div>
      <div className="block">
        {user ? (
          <Link to={`/profile/${user.id}`}>
            <button className="justify-center md:inline-flex h-12 w-12" 
            >
              <img
                src={user?.avatar || './default-avatar.png'}
                alt="Profile"
                height={45}
                width={45}
                className="rounded-full border"
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
