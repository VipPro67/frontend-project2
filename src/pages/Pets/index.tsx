import { useState } from 'react';
import { fetchPetsSearch } from '../../api';
import LeftSidebar from '../../components/LeftSidebar';
import { IPet } from '../../../types';
import { Link } from 'react-router-dom';
type IResponse = {
  data: IPet[];
  total: number;
  currentPage: number;
  items_per_page: number;
  totalPage: number;
  nextPage: number | null;
  prePage: number | null;
};
const PetsPage = () => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    window.location.href = '/sign-in';
  }
  const [listFindPets, setListFindPets] = useState<any | null>(null);
  const [view, setView] = useState('searchPets');

  const handleSearch = async () => {
    const search = document.getElementById('search') as HTMLInputElement;
    const res: IResponse = await fetchPetsSearch(search.value);
    setListFindPets(res.data);
  };
  const showFindResults = () => {
    return (
      <div className="mx-3 mb-6 gap-1 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
        {listFindPets
          ? listFindPets.map((pet: IPet) => (
              <div className="w-full px-3 mb-6 border rounded overflow-hidden shadow-lg ">
                <div className="max-w-sm">
                  <img
                    className="h-full hover:scale-105"
                    src={
                      pet.avatar
                        ? pet.avatar
                        : './assets/images/default-avatar.png'
                    }
                    alt="Buddy's Avatar"
                  ></img>
                  <div className="p-4">
                    <div className="flex justify-between">
                      <div className="font-bold text-xl mb-2">{pet.name}</div>
                    </div>
                    <p className="text-gray-700 text-base">
                      <strong>Species:</strong> {pet.species}
                    </p>
                    <p className="text-gray-700 text-base">
                      <strong>Sex:</strong> {pet.sex}
                    </p>
                    <p className="text-gray-700 text-base">
                      <strong>Breed:</strong> {pet.breed}
                    </p>
                    <p className="text-gray-700 text-base">
                      <strong>Date of Birth:</strong>{' '}
                      {new Date(pet.date_of_birth).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 text-base">
                      <strong>Description:</strong> {pet.description}
                    </p>
                  </div>
                </div>{' '}
                <div className="grid p-2">
                  <b>Owner:</b>
                  <div className="flex justify-start pl-5 items-center">
                    <Link to={`/profile/${pet.owner.id}`}>
                      <img
                        className="w-10 h-10 rounded-full"
                        src={pet.owner.avatar ? pet.owner.avatar : ''}
                        alt=""
                      />
                    </Link>
                    <div className="ml-2">
                      <p className="text-sm font-medium text-gray-900">
                        {pet.owner.first_name} {pet.owner.last_name}
                      </p>
                    </div>
                  </div>
                </div>{' '}
              </div>
            ))
          : null}
      </div>
    );
  };

  return (
    <div className="xl:grid xl:grid-cols-12 ">
      <LeftSidebar />
      <div className=" xl:col-span-10 xl:p-2 xl:rounded-xl bg-white xl:m-2 ">
        <div className=" gird">
          <Link to="/pets/my-pets">
            <button
              className={
                view == 'myPets'
                  ? 'm-2 border-2 rounded-2xl text-center font-bold p-2 underline'
                  : 'm-2 border-2 rounded-2xl text-center font-bold p-2'
              }
              onClick={() => setView('myPets')}
            >
              My Pets
            </button>
          </Link>
          <Link to='/pets'>
            <button
              className={
                view == 'searchPets'
                  ? 'm-2 border-2 rounded-2xl text-center font-bold p-2 underline'
                  : 'm-2 border-2 rounded-2xl text-center font-bold p-2'
              }
              onClick={() => setView('searchPets')}
            >
              Search Pet
            </button>
          </Link>
        </div>
        {view == 'searchPets' ? (
          <div>
            <h1
              className="text-2xl text-center font-bold m-2"
              onClick={() => {
                setView('FindPets');
              }}
            >
              Find Pets{' '}
            </h1>
            <div className="grid grid-cols-3 gap-4">
              {view ? (
                <div className=" col-span-3">
                  <div className="flex justify-between">
                    <label className="m-2 w-[80%] h-12 ">
                      <input
                        id="search"
                        type="search"
                        className="h-9 px-2 text-lg w-full border-2 border-slate-950"
                        placeholder="Search by name, species, breed or description"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSearch();
                          }
                        }}
                      ></input>
                    </label>
                    <button onClick={handleSearch}>
                      <img
                        src="../../assets/icons/search.svg"
                        height={32}
                        width={32}
                        alt="search"
                        className="mx-2"
                      />
                    </button>
                  </div>
                  {showFindResults()}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
      <div></div>
    </div>
  );
};

export default PetsPage;
