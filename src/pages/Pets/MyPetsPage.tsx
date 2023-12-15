import { useEffect, useState } from 'react';
import { fetchMyPets } from '../../api';
import LeftSidebar from '../../components/LeftSidebar';
import Pet from '../../components/Pet';
import { IPet } from '../../../types';
import { Link } from 'react-router-dom';
const MyPetsPage = () => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    window.location.href = '/sign-in';
  }
  const [listPets, setListPets] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('myPets');
  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    species: '',
    sex: '',
    breed: '',
    description: '',
    avatar: null as File | null,
  });
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response: any = await fetchMyPets();
      setListPets({
        response,
      });
    };
    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once

  const handlerSubmit = () => {
    const formDataP = new FormData();
    formDataP.append('name', formData.name);
    formDataP.append('date_of_birth', formData.date_of_birth);
    formDataP.append('species', formData.species);
    formDataP.append('sex', formData.sex);
    formDataP.append('breed', formData.breed);
    formDataP.append('description', formData.description);
    if (selectedMedia) {
      formDataP.append('avatar', selectedMedia);
    }
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const addNewPet = () => {
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay, show/hide based on modal state. */}
          <div
            className="fixed inset-0 transition-opacity"
            aria-hidden="true"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          {/* Modal panel, show/hide based on modal state. */}
          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <form className="w-full max-w-lg xl:p-4">
              <div className="grid mx-3 mb-6">
                <h1 className="text-2xl font-bold">Add New Pet</h1>
                <div className="w-full px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="pet-name"
                  >
                    Name
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="pet-name"
                    type="text"
                    placeholder="Buddy"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="w-full px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="pet-dob"
                  >
                    Date of Birth
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="pet-dob"
                    type="date"
                    placeholder="Buddy"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_of_birth: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="w-full px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="pet-species"
                  >
                    Species
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="pet-sp"
                    type="text"
                    placeholder="Dog"
                    value={formData.species}
                    onChange={(e) =>
                      setFormData({ ...formData, species: e.target.value })
                    }
                  />
                </div>
                <div className="w-full px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="pet-breed"
                  >
                    Breed
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="pet-breed"
                    type="text"
                    placeholder="Golden Retriever"
                    value={formData.breed}
                    onChange={(e) =>
                      setFormData({ ...formData, breed: e.target.value })
                    }
                  />
                </div>

                <div className="w-full px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="pet-sex"
                  >
                    Sex
                  </label>

                  <select
                    id="pet-sex"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    value={formData.sex}
                    onChange={(e) =>
                      setFormData({ ...formData, sex: e.target.value })
                    }
                  >
                    <option value="Male" className="bg-gray-200">
                      {' '}
                      Male
                    </option>
                    <option value="Female" className="bg-gray-200">
                      Female
                    </option>
                  </select>
                </div>
                <div className="w-full px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="description"
                    placeholder="Buddy is a very cute dog and he is very friendly"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="w-full px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="pet-image"
                  >
                    Image
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="pet-image"
                    type="file"
                    accept=".jpg,.png,.jpeg,.mp4,.avi,.mkv"
                    onChange={(e) =>
                      setSelectedMedia(e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>
            </form>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none  sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => handlerSubmit()}
              >
                Add
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-50 text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none  sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
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
        {view == 'myPets' ? (
          <div>
            <h1
              className="text-2xl text-center font-bold m-2"
              onClick={() => {
                setView('myPets');
              }}
            >
              My Pets{' '}
            </h1>
            <div className="flex justify-end">
              <button
                className="bg-blue-500  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                Add New Pet
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4">
              {listPets
                ? listPets.response.map((pet: IPet) => (
                    <Pet key={pet.id} {...pet} />
                  ))
                : null}
            </div>
          </div>
        ) : null}
        {isModalOpen ? addNewPet() : null}
      </div>
      <div></div>
    </div>
  );
};

export default MyPetsPage;
