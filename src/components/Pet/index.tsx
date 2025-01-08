import axios from 'axios';
import { useEffect, useState } from 'react';
import { IPet, IUser } from '../../../types';
import { checkJwt } from '../../../utils/auth';
const API_URL = import.meta.env.VITE_API_URL;

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
      .put(`${API_URL}/api/v1/pets/${pet.id}`, formDataS, {
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
      .delete(`${API_URL}/api/v1/pets/${pet.id}`, {
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
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
                <svg
                  className="h-6 w-6 m-2"
                  viewBox="0 0 24 24"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000000"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {' '}
                    <title>ic_fluent_pair_24_regular</title>{' '}
                    <desc>Created with Sketch.</desc>{' '}
                    <g
                      id="🔍-Product-Icons"
                      stroke="none"
                      stroke-width="1"
                      fill="none"
                      fill-rule="evenodd"
                    >
                      {' '}
                      <g
                        id="ic_fluent_pair_24_regular"
                        fill="#212121"
                        fill-rule="nonzero"
                      >
                        {' '}
                        <path
                          d="M18.6688116,21.0008494 L11.3311884,21.0008494 C11.0501489,21.5916283 10.4477646,22 9.75,22 C8.78350169,22 8,21.2164983 8,20.25 C8,19.5494852 8.4115972,18.945104 9.00614466,18.6655035 L9.006,14.995 L5.33355442,14.9958554 C5.07287844,15.5483392 4.53158585,15.9424039 3.89352721,15.9941988 L3.75,16 C2.78350169,16 2,15.2164983 2,14.25 C2,13.5518425 2.40883171,12.9491727 3.00014872,12.6683372 L3.00016701,5.33118843 C2.4093881,5.05014895 2.0010164,4.44776464 2.0010164,3.75 C2.0010164,2.78350169 2.78451809,2 3.7510164,2 C4.44878103,2 5.05116535,2.40837171 5.33220482,2.99915061 L12.6688116,2.99915061 C12.9498511,2.40837171 13.5522354,2 14.25,2 C15.2164983,2 16,2.78350169 16,3.75 C16,4.44972906 15.5893257,5.05354 14.9958554,5.33355442 L14.995,9.004 L18.6664456,9.00414463 C18.9271216,8.45166077 19.4684141,8.05759611 20.1064728,8.0058012 L20.25,8 C21.2164983,8 22,8.78350169 22,9.75 C22,10.4473717 21.592088,11.0494706 21.0018472,11.3307134 L21.0018472,18.6692866 C21.592088,18.9505294 22,19.5526283 22,20.25 C22,21.2164983 21.2164983,22 20.25,22 C19.5522354,22 18.9498511,21.5916283 18.6688116,21.0008494 L11.3311884,21.0008494 L18.6688116,21.0008494 Z M18.6707154,10.5048384 L14.995,10.504 L14.9958668,12.663829 C15.5457303,12.9254046 15.9375775,13.4653557 15.9892162,14.1014902 L15.9950174,14.2450174 C15.9950174,15.2115157 15.2115157,15.9950174 14.2450174,15.9950174 C13.5472528,15.9950174 12.9448684,15.5866457 12.663829,14.9958668 L10.506,14.995 L10.5068308,18.6716709 C10.8676608,18.8450084 11.1598743,19.1384371 11.3316628,19.5001487 L18.6683372,19.5001487 C18.84139,19.135775 19.1366469,18.840693 19.5011472,18.6678633 L19.5011472,11.3321367 C19.190145,11.1846734 18.929552,10.9482105 18.7522646,10.6556444 L18.6707154,10.5048384 L18.6707154,10.5048384 Z M13.495,10.504 L11.3292846,10.5048384 C11.1571846,10.8642598 10.8660011,11.155789 10.5068308,11.3283291 L10.506,13.495 L12.6633545,13.4951661 C12.8362494,13.1311251 13.1311251,12.8362494 13.4951661,12.6633545 L13.495,10.504 Z M12.6683372,4.49985128 L5.33267925,4.49985128 C5.15978442,4.86389225 4.86490865,5.15876802 4.50084939,5.33166285 L4.50084939,12.6688116 C4.862768,12.8409799 5.15623024,13.1337471 5.32928462,13.4951616 L9.006,13.495 L9.00614466,11.3344965 C8.45261197,11.0741842 8.05765859,10.5323555 8.0058012,9.89352721 L8,9.75 C8,8.78350169 8.78350169,8 9.75,8 C10.4497291,8 11.05354,8.41067433 11.3335544,9.00414463 L13.495,9.004 L13.4951616,5.32928462 C13.185093,5.18081596 12.9255519,4.94372169 12.7493445,4.65080791 L12.6683372,4.49985128 Z"
                          id="🎨-Color"
                        >
                          {' '}
                        </path>{' '}
                      </g>{' '}
                    </g>{' '}
                  </g>
                </svg>
              </button>
            ) : null}
          </div>
          <div>
            {currentUser?.id == pet.owner.id ? (
              <button
                className="bg-red"
                onClick={() => setIsEditModalOpen(true)}
              >
                <svg
                  className=" h-4 w-4"
                  viewBox=" 0 0 24 24"
                  fill="#FFFFFF"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM13.9334 7.3787L3.86165 17.4505C3.72205 17.5901 3.6269 17.7679 3.58818 17.9615L3.00111 20.8968L5.93645 20.3097C6.13004 20.271 6.30784 20.1759 6.44744 20.0363L16.5192 9.96448L13.9334 7.3787Z"
                      fill="#0F0F0F"
                    ></path>
                  </g>
                </svg>
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
