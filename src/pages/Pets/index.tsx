import { useEffect, useState } from 'react';
import { fetchMyPets } from '../../api';
import LeftSidebar from '../../components/LeftSidebar';

const PetsPage = () => {
  const [listPets, setListPets] = useState<any | null>(null); // Use state to handle asynchronous data

  useEffect(() => {
    const fetchData = async () => {
      const response: any = await fetchMyPets();
      setListPets({
        response,
      });
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once

  const showlistPets = () => {
    if (listPets) {
      return listPets.response.map((pet: any) => {
        return (
          <div className="max-w-sm border rounded overflow-hidden shadow-lg">
            <img
              className="w-full hover:scale-105"
              src={pet.avatar}
              alt="Buddy's Avatar"
            ></img>
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{pet.name}</div>
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
          </div>
        );
      });
    }
  };

  return (
    <div className="xl:grid xl:grid-cols-12">
      <LeftSidebar />
      <div className=" xl:col-span-7 xl:p-2 xl:rounded-xl bg-white xl:m-2 h-full">
        <h1 className="text-2xl text-center font-bold m-2">My Pets</h1>
        <hr></hr>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
          {showlistPets()}
        </div>
        <hr />
      </div>
      <div></div>
    </div>
  );
};

export default PetsPage;
