import { useEffect, useState } from 'react';
import LeftSidebar from '../../components/LeftSidebar';
import { IPet, IUser } from '../../../types';
import { Link } from 'react-router-dom';
import { fetchPetsPair } from '../../api';
const PairPetsPage = () => {
  const petId = window.location.pathname.split('/')[3];
  const [pet, setPet] = useState<IPet>();
  const [listFindPets, setListFindPets] = useState<any | null>(null);

  const [view, setView] = useState('');
  useEffect(() => {
    const getPet = async () => {
      const res = await fetch(`http://localhost:3001/api/v1/pets/${petId}`);
      const data = await res.json();
      setPet(data);
    };
    getPet();
    const fetchPets = async () => {
      const res = await fetchPetsPair(petId);
      setListFindPets(res);
    };
    fetchPets();
  }, []);
  return (
    <div>
      <div className="xl:grid xl:grid-cols-12 ">
        <LeftSidebar />
        <div className=" xl:col-span-10 xl:p-2 xl:rounded-xl bg-white xl:m-2">
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
          <p className="text-2xl text-center font-bold m-2">Pair Pets</p>
          <div className=" rounded overflow-hidden shadow-lg gird md:flex ">
            <div>
              <img
                className="md:h-96 "
                src={
                  pet?.avatar
                    ? pet?.avatar
                    : './assets/images/default-avatar.png'
                }
                alt="Buddy's Avatar"
              ></img>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex ">
                  <div className="font-bold text-xl mb-2">{pet?.name}</div>
                </div>
              </div>
              <p className="text-gray-700 text-base">
                <strong>Species:</strong> {pet?.species}
              </p>
              <p className="text-gray-700 text-base">
                <strong>Sex:</strong> {pet?.sex}
              </p>
              <p className="text-gray-700 text-base">
                <strong>Breed:</strong> {pet?.breed}
              </p>
              <p className="text-gray-700 text-base">
                <strong>Date of Birth:</strong>{' '}
                {pet?.date_of_birth
                  ? new Date(pet.date_of_birth).toLocaleDateString()
                  : ''}
              </p>
              <p className="text-gray-700 text-base">
                <strong>Description:</strong> {pet?.description}
              </p>
            </div>
          </div>
          <p className="text-2xl text-center font-bold m-2">Result </p>
          <div className="mx-3 mb-6 gap-1 grid xl:grid-cols-3 lg:grid-cols-2">
            {listFindPets
              ? listFindPets.map((pet: IPet) => (
                  <div className="w-full px-3 mb-6 border rounded overflow-hidden shadow-lg  ">
                    <div className="max-w-sm">
                      <img
                        className="h-full mx-auto hover:scale-105"
                        src={
                          pet.avatar
                            ? pet.avatar
                            : './assets/images/default-avatar.png'
                        }
                        alt="Buddy's Avatar"
                      ></img>
                      <div className="p-4">
                        <div className="flex justify-between">
                          <div className="font-bold text-xl mb-2">
                            {pet.name}
                          </div>
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
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default PairPetsPage;
