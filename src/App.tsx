import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoutes } from './PrivateRoutes';
import SignIn from './pages/SignIn';
import { useEffect, useState } from 'react';
import { IUser } from '../types';
import { checkJwt } from '../utils/auth';
import Layout from './components/Layout';
import HomePage from './pages/Home';

export const AppRouter = () => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  useEffect(() => {
    async function fetchCurrentUser() {
      const response: IUser | null = await checkJwt();
      setCurrentUser(response);
    }

    fetchCurrentUser();
    console.log('currentUser', currentUser);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {currentUser ? (
          <Route element={<Layout />}>
            <Route path="/*" element={<PrivateRoutes />} />
          </Route>
        ) : (
          <Route path="sign-in" element={<SignIn />} />
        )}
        <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/sign-in" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
