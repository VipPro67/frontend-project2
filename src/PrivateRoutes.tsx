import { Route, Routes} from 'react-router-dom';
import HomePage from './pages/Home';
import FriendsPage from './pages/Friends';
import PetsPage from './pages/Pets';
import GroupsPage from './pages/Groups';
import CreatePostPage from './pages/CreatePost';
import ProfilePage from './pages/Profile';
import NewFeedPage from './pages/NewFeed';
import NotFound from './pages/NotFound';
import FriendsRequestPage from './pages/Friends/FriendsRequestPage';
import FriendsSentPage from './pages/Friends/FriendsSentPage';
import SearchFriendsPage from './pages/Friends/SeachFriendsPage';
import MyPetsPage from './pages/Pets/MyPetsPage';
import PairPetsPage from './pages/Pets/PairPetPage';
import MyGroupsPage from './pages/Groups/MyGroupsPage';
import GroupsProfilePage from './pages/Groups/GroupsProfilePage';
import MessagerPage from './pages/Messager';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

export const PrivateRoutes = () => {
  const isAuth = localStorage.getItem('access_token');
  return (
    <Routes>
      {isAuth ? (
        <Route>
          <Route path="/" element={<HomePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route
            path="/friends/friends-request"
            element={<FriendsRequestPage />}
          />
          <Route path="/friends/friends-sent" element={<FriendsSentPage />} />
          <Route path="/friends/search" element={<SearchFriendsPage />} />
          <Route path="/pets/my-pets" element={<MyPetsPage />} />
          <Route path="/pets" element={<PetsPage />} />
          <Route path="/pets/pair/:id" element={<PairPetsPage />} />
          <Route path="/groups" element={<MyGroupsPage />} />
          <Route path="/groups/:id" element={<GroupsProfilePage />} />
          <Route path="/groups/search" element={<GroupsPage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/new-feed" element={<NewFeedPage />} />
          <Route path="/messager" element={<MessagerPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      ) : (
        <Route>
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      )}
    </Routes>
  );
};
