import { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const isSignInPage = location.pathname === '/sign-in';
  const isSignUpPage = location.pathname === '/sign-up';

  if (isSignInPage || isSignUpPage) {
    // Return something else or nothing for the sign-in page
    return <Outlet />;
  }

  return (
    <div className="min-h-full flex flex-col font-sans text-neutral-800 bg-gray-200">
      <Header />
      <Suspense>
        <div className=' max-w-7xl w-full m-auto'>
          <Outlet />
        </div>
      </Suspense>
    </div>
  );
};

export default Layout;
