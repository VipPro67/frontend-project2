import LeftSidebar from "../../components/LeftSidebar";

const GroupsPage = () => {
  return (
    <div className='xl:grid xl:grid-cols-12'>
      <LeftSidebar />
      <div className=' col-span-7 bg-white rounded-xl m-2' >
        <h1>Groups</h1>
      </div>
      <div></div>
    </div>
  );
};

export default GroupsPage;
