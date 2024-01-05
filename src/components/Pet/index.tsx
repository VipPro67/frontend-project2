import { useEffect, useState } from 'react';
import { IPet, IUser } from '../../../types';
import axios from 'axios';
import { checkJwt } from '../../../utils/auth';

const Pet = (pet: IPet) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [currentUser, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await checkJwt();
      setUser(userData);
    };
    fetchUser();
  }, []);
  const [formData, setFormData] = useState({
    name: pet.name,
    date_of_birth: pet.date_of_birth,
    species: pet.species,
    sex: pet.sex,
    breed: pet.breed,
    description: pet.description,
    avatar: null as File | null,
  });

  const handlerSubmit = () => {
    confirm('Are you sure you want to edit this pet?');
    const formDataS = new FormData();
    formDataS.append('name', formData.name);
    formDataS.append('date_of_birth', formData.date_of_birth);
    formDataS.append('species', formData.species);
    formDataS.append('sex', formData.sex);
    formDataS.append('breed', formData.breed);
    formDataS.append('description', formData.description);
    if (selectedMedia) {
      formDataS.append('avatar', selectedMedia);
    }
    axios
      .put(`http://localhost:3001/api/v1/pets/${pet.id}`, formDataS, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          alert('Pet edited successfully');
          window.location.href = '/my-pets';
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlerDelete = () => {
    confirm('Are you sure you want to delete this pet?');
    axios
      .delete(`http://localhost:3001/api/v1/pets/${pet.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          alert('Pet deleted successfully');
          window.location.href = '/my-pets';
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editPet = () => {
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay, show/hide based on modal state. */}
          <div
            className="fixed inset-0 transition-opacity"
            aria-hidden="true"
            onClick={() => setIsEditModalOpen(false)}
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
                <div className="flex justify-between p-2">
                  <h1 className="text-2xl font-bold">Edit pet</h1>
                  <button className="bg-red" onClick={() => handlerDelete()}>
                    <img
                      src="https://project2-media.s3.ap-southeast-1.amazonaws.com/assets/icons/delete.svg"
                      height={24}
                      width={24}
                      title="Delete"
                      alt="Delete"
                    ></img>
                  </button>
                </div>
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
                    value={
                      new Date(formData.date_of_birth)
                        .toISOString()
                        .split('T')[0]
                    }
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
                Edit
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-50 text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none  sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setIsEditModalOpen(false)}
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
    <div className="max-w-sm border rounded overflow-hidden shadow-lg grid grid-rows-2">
      <div className="w-full row-span-1">
        <img
          className="h-full hover:scale-105 w-full lazyload"
          src={pet.avatar ? pet.avatar : './assets/images/default-avatar.png'}
          alt="{pet.name}"
        ></img>
      </div>
      <div className="p-4 row-span-1">
        <div className="flex items-center justify-between">
          <div className="flex ">
            <div className="font-bold text-xl mb-2">{pet.name}</div>
            {currentUser?.id == pet.owner.id ? (
              <button
                className="bg-red"
                onClick={() => {
                  if (
                    window.confirm('Are you sure you want to pair this pet?')
                  ) {
                    window.location.href = `/pets/pair/${pet.id}`;
                  }
                }}
              >
                <img
                  src="https://project2-media.s3.ap-southeast-1.amazonaws.com/assets/icons/pair.svg"
                  height={24}
                  width={24}
                  title="Pair"
                  alt="Pair"
                  className="ml-3"
                ></img>
              </button>
            ) : null}
          </div>
          <div>
            {currentUser?.id == pet.owner.id ? (
              <button
                className="bg-red"
                onClick={() => setIsEditModalOpen(true)}
              >
                <img
                  src="https://project2-media.s3.ap-southeast-1.amazonaws.com/assets/icons/edit.svg"
                  height={24}
                  width={24}
                  title="Edit"
                  alt="Edit"
                ></img>
              </button>
            ) : null}
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
      {isEditModalOpen ? editPet() : null}
    </div>
  );
};

export default Pet;
