import { useEffect, useState } from 'react';
import LeftSidebar from '../../components/LeftSidebar';
import { useParams } from 'react-router-dom';
import { IGroup, IPost, IUser } from '../../../types';
import { fetchGroupsById, fetchPostsByGroupId } from '../../api';
import Post from '../../components/Post';
import { checkJwt } from '../../../utils/auth';

const GroupsProfilePage = () => {
  const [listPost, setListPost] = useState<any | null>(null);
  const [currentUser, setUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  const groupsId = id;
  const [group, setGroup] = useState<IGroup | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      const userData = await checkJwt();
      setUser(userData);
    };
    checkAuth();
    const fetchData = async () => {
      const response: IPost = await fetchPostsByGroupId(groupsId || '');
      setListPost({
        response,
      });
    };
    if (!listPost) {
      fetchData();
    }
    const fetchGroup = async () => {
      const response: any = await fetchGroupsById(groupsId || '');
      setGroup(response);
    };
    if (!group) {
      fetchGroup();
    }
  }, [listPost]);

  const showGroupMembers = () => {
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 transition-opacity"
            aria-hidden="true"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div
            className="  xl:p-4 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="flex justify-between">
              <h1 className="text-lg font-medium text-gray-900">
                {group?.name} members
              </h1>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Close
              </button>
            </div>
            {group?.users?.map((user) => (
              <div className="flex justify-between border rounded m-2 p-2 max ">
                <div className="flex items-center">
                  <img
                    className="w-20 h-20 rounded-full"
                    src={
                      user.avatar
                        ? user.avatar
                        : 'https://via.placeholder.com/100'
                    }
                    alt=""
                  />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  const showGroupInfo = () => {
    const isMember = group?.users?.find((user) => user.id == currentUser?.id);

    if (group) {
      return (
        <div className="flex flex-col">
          <img
            className=" w-32 h-32 rounded-full mx-auto"
            src={
              group.avatar && group.avatar != 'null'
                ? group.avatar
                : 'https://via.placeholder.com/100'
            }
            alt=""
          />
          <p className="text-lg font-medium text-gray-900 mx-auto">{group.name}</p>
          <button onClick={() => setIsModalOpen(true)}>
            <p className="text-md font-medium text-gray-900 m-2">
              {group.users?.length || 0} members
            </p>
          </button>

          <div className="">
            {isMember ? (
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full float-right">
                Leave
              </button>
            ) : (
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                Join
              </button>
            )}
          </div>
        </div>
      );
    }
  };
  return (
    <div className="xl:grid xl:grid-cols-12">
      <LeftSidebar />
      <div className=" xl:col-span-10  xl:p-2 xl:rounded-xl  bg-white xl:m-2 ">
        <div className=" gird">
          {showGroupInfo()}
          {isModalOpen ? showGroupMembers() : null}
          <div className="grid ">
            {listPost
              ? listPost.response.map((post: any) => (
                  <Post key={post.id} {...post} />
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsProfilePage;
