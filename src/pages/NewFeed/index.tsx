import { useEffect, useState } from 'react';
import LeftSidebar from '../../components/LeftSidebar';
import { IPost, IUser } from '../../../types';
import { fetchPostsRecomendation } from '../../api';
import Post from '../../components/Post';
import { checkJwt } from '../../../utils/auth';

const ListPost = () => {
  const [listPost, setListPost] = useState<IPost[] | null>(null); // Use state to handle asynchronous data

  useEffect(() => {
    const fetchData = async () => {
      const response: IPost[] = await fetchPostsRecomendation();
      setListPost(response);
    };
    fetchData();
  }, []);

  return (
    <div className="xl:col-span-10 xl:p-2 xl:rounded-xl bg-white xl:m-2 ">
      {listPost?.map((post: IPost) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};
const NewFeedPage = () => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    window.location.href = '/sign-in';
  }
  return (
    <div className="xl:grid xl:grid-cols-12">
      <LeftSidebar />
      <ListPost />
      <div></div>
    </div>
  );
};

export default NewFeedPage;
