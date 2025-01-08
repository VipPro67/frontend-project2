import { useEffect, useState } from 'react';
import LeftSidebar from '../../components/LeftSidebar';
import { IPost } from '../../../types';
import { fetchPosts } from '../../api';
import Post from '../../components/Post';
type IResponse = {
  data: IPost[];
  total: number;
  currentPage: number;
  items_per_page: number;
  totalPage: number;
  nextPage: number | null;
  prePage: number | null;
};

const ListPost = () => {
  const [listPost, setListPost] = useState<IResponse | null>(null); // Use state to handle asynchronous data

  useEffect(() => {
    const fetchData = async () => {
      const response: IResponse = await fetchPosts();
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
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div className="xl:col-span-10 xl:rounded-xl bg-white">
      {listPost?.data.map((post: IPost) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};
const HomePage = () => {
  // const showChat = () => {
  //   const chat = document.getElementById('chatbot');
  //   if (chat) {
  //     chat.style.display = 'block';
  //   }
  //   const btn = document.getElementById('btn-close-chat');
  //   if (btn) {
  //     btn.style.display = 'block';
  //   }
  //   const btn1 = document.getElementById('btn-chat');
  //   if (btn1) {
  //     btn1.style.display = 'none';
  //   }
  // };
  // const closeChat = () => {
  //   const chat = document.getElementById('chatbot');
  //   if (chat) {
  //     chat.style.display = 'none';
  //   }
  //   const btn = document.getElementById('btn-close-chat');
  //   if (btn) {
  //     btn.style.display = 'none';
  //   }
  //   const btn1 = document.getElementById('btn-chat');
  //   if (btn1) {
  //     btn1.style.display = 'block';
  //   }
  // };
  return (
    <div className="xl:grid xl:grid-cols-12 ">
      <LeftSidebar />
      <ListPost />
      {/* <div className=" fixed bottom-0 right-0 ">
        <button
          id="btn-chat"
          onClick={showChat}
          className=" bg-slate-200 flex justify-between"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/2068/2068998.png"
            alt="chat"
            className="w-10 h-10 mx-auto"
          />
          Chat with me
        </button>
        <div>
          <button
            id="btn-close-chat"
            onClick={closeChat}
            className="hidden absolute top-0 right-0 bg-slate-200 p-2"
          >
            {' X '}
          </button>
          <iframe
            id="chatbot"
            allow="microphone;"
            width="350"
            height="430"
            src="https://console.dialogflow.com/api-client/demo/embedded/ebe4b056-14a2-460d-9218-484dcb5dee23"
            className="hidden"
          ></iframe>
        </div>
      </div> */}
      {/* <div className=" fixed bottom-16 right-0 ">
        <button
          id="btn-chat"
          onClick={showChat}
          className=" bg-slate-200 flex justify-between"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/2068/2068998.png"
            alt="chat"
            className="w-10 h-10 mx-auto"
          />
          Chat with me
        </button>
        <div>
          <button
            id="btn-close-chat"
            onClick={closeChat}
            className="hidden absolute top-0 right-0 bg-slate-200 p-2"
          >
            {' X '}
          </button>
          <iframe
            id="chatbot"
            allow="microphone;"
            width="350"
            height="430"
            src="https://console.dialogflow.com/api-client/demo/embedded/ebe4b056-14a2-460d-9218-484dcb5dee23"
            className="hidden"
          ></iframe>
        </div>
      </div> */}
    </div>
  );
};

export default HomePage;
