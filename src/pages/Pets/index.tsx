import { useEffect, useState } from 'react';
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

  useEffect(() => {
    async function fetchCurrentUser() {
    }

    fetchCurrentUser();
  }, []);
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
              <div className="w-full px-3 mb-6 border rounded overflow-hidden shadow-lg grid grid-rows-2">
                <img
                  className="h-full hover:scale-105"
                  src={
                    pet.avatar
                      ? pet.avatar
                      : './assets/images/default-avatar.png'
                  }
                  alt={pet.name}
                ></img>
                <div className="max-w-sm row-span-1 ">
                  <div className="p-4 row-span-1">
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
          <Link to="/pets">
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
                      <svg
                        className="w-6 h-6 transform-rotate-45 mb-2 mr-4 "
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {' '}
                          <path
                            d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                            stroke="#000000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>{' '}
                        </g>
                      </svg>
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
