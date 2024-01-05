import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivateRoutes } from './PrivateRoutes';
import Layout from './components/Layout';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/*" element={<PrivateRoutes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
