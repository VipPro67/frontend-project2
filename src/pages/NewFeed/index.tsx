import { useEffect, useState } from 'react';
import LeftSidebar from '../../components/LeftSidebar';
import { IPost, IUser } from '../../../types';
import { fetchPostsRecomendation } from '../../api';
import Post from '../../components/Post';
import { checkJwt } from '../../../utils/auth';

type IReponse = {
  data: IPost[];
  total: number;
  currentPage: number;
  items_per_page: number;
  totalPage: number;
  nextPage: number | null;
  prePage: number | null;
};

const ListPost = () => {
  const [listPost, setListPost] = useState<IReponse | null>(null); // Use state to handle asynchronous data

  useEffect(() => {
    const fetchData = async () => {
      const response: IReponse = await fetchPostsRecomendation();
      setListPost({
        data: response.data,
        total: response.total,
        currentPage: response.currentPage,
        items_per_page: response.items_per_page,
        totalPage: response.totalPage,
        nextPage: response.nextPage,
        prePage: response.prePage,
      });
    };
    fetchData();
  }, []);

  return (
    <div className="xl:col-span-10 xl:p-2 xl:rounded-xl bg-white xl:m-2 ">
      {listPost?.data.map((post: IPost) => (
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
