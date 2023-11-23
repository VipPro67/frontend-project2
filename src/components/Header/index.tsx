import { Link } from 'react-router-dom';
import HeaderLink from './HeaderLink';
import { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  const toggleNav = () => {
    setIsNavOpen((v) => !v);
  };

  return (
    <header className="flex items-center px-4 text-xl w-full max-w-screen-2xl flex-wrap justify-between md:justify-between mx-auto p-4">
      <Link to="/" className="text-2xl font-bold text-green-900/70">
        #PETMD
      </Link>

      <button
        className="inline-flex items-center p-2 w-10 h-10 justify-center md:hidden stroke-2"
        onClick={toggleNav}
      >
        <Bars3Icon className="w-6 h-6 stroke-2" />
      </button>

      <div className={`${isNavOpen ? '' : 'hidden'} w-fit md:block md:w-auto`}>
        <ul className="text-base flex flex-col p-4 space-y-2 md:p-0 md:flex-row md:space-x-4 md:space-y-0">
          <HeaderLink to="/" text="Home" />
          <HeaderLink to="/friends" text="Friends" />
          <HeaderLink to="/pets" text="Pets" />
          <HeaderLink to="/groups" text="Groups" />
        </ul>
      </div>

      <div className=' hidden md:block'>
        <button className="justify-center hidden md:inline-flex">
          <img
            src="./default-avatar.png"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
