import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import HomePage from './pages/Home';
import FriendsPage from './pages/Friends';
import PetsPage from './pages/Pets';
import GroupsPage from './pages/Groups';
import CreatePostPage from './pages/CreatePost';
import ProfilePage from './pages/Profile';
import NewFeedPage from './pages/NewFeed';
import NotFound from './pages/NotFound';

import './App.css';
import Layout from './components/Layout';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/friends" element={<FriendsPage />} />
      <Route path="/pets" element={<PetsPage />} />
      <Route path="/groups" element={<GroupsPage />} />
      <Route path="/create-post" element={<CreatePostPage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/new-feed" element={<NewFeedPage />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
export default function App() {
  return <RouterProvider router={router}></RouterProvider>;
}
