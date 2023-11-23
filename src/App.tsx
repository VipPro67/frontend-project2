import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import HomePage from './pages/Home';
import FriendsPage from './pages/Friends';
import PetsPage from './pages/Pets';
import GroupsPage from './pages/Groups';
import NotFound from './pages/NotFound';
import './App.css';
import Layout from './components/Layout';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
<Route path="/friends" element={<FriendsPage />} />
<Route path="/pets" element={<PetsPage />} />
<Route path="/groups" element={<GroupsPage />} />

      <Route path="*" element={<NotFound />} />


    </Route>
  )
);
export default function App() {
  return <RouterProvider router={router}></RouterProvider>;
}
