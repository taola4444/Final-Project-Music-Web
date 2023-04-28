import React, { useState } from 'react';
import { useStateValue } from "../context/StateProvider";
import { useEffect } from 'react';
import { actionType } from "../context/reducer";
import { storage } from '../config/firebase';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { BiCloudUpload } from 'react-icons/bi';
import CircularProgress from '@mui/material/CircularProgress';
import { MdDelete } from 'react-icons/md';
import { editUserApi, getUserById } from '../api/index';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from "react-router-dom";
import { Logo } from '../../src/assets/img';

const UserProfile = () => {
  const [userImageCorver, setuserImageCorver] = useState(null);
  const [isImageLoading, setisImageLoading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [{ user }, dispatch] = useStateValue();
  const [name, setName] = useState("");
  const [{ alertType }, dispath] = useStateValue();
  const navigate = useNavigate();


  const deleteFileObj = (url) => {
    const deleteRef = ref(storage, url);

    setisImageLoading(true);
    deleteObject(deleteRef).then(() => {
      setuserImageCorver(null);
      setisImageLoading(false);
    });

    dispath({
      type: actionType.SET_ALERT_TYPE,
      alertType: "success"
    });
    setInterval(() => {
      dispath({
        type: actionType.SET_ALERT_TYPE,
        alertType: null
      });
    }, 4000)
  }

  useEffect(() => {
    if (!user) {
      dispatch({
        type: actionType.SET_USER,
        user: user,
      });
    }
  }, []);

  const submitEdit = () => {
    const data = {
      name: name === "" ? user?.name : name,
      imageURL: userImageCorver === null ? user?.imageURL : userImageCorver,
    };

    editUserApi(user?.user?._id, data).then((res) => {
      if (res.status === 200) {
        getUserById(res?.data?.user?._id).then(res => {
          dispatch({
            type: actionType.SET_USER,
            user: res?.data
          })
        })
        navigate("/", { replace: true });
      }
    })
  }
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src={Logo} alt="logo" />
          Music App
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Edit Profile
            </h1>
            <htmlForm className="space-y-4 md:space-y-6" action="#">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder={user?.user?.name} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
              </div>
              <div>
                {
                  isImageLoading && <FileLoader progress={imageUploadProgress} />
                }
                {
                  !isImageLoading && (
                    <>
                      {
                        !userImageCorver ? (
                          <FileUploader updateState={setuserImageCorver} setProgress={setImageUploadProgress} isLoading={setisImageLoading} isImage={true} />
                        ) : (<div className='relative w-full h-300 overflow-hidden rounded-md'>
                          <img src={userImageCorver} className='h-auto max-w-xs mx-auto' />
                          <button onClick={() => deleteFileObj(userImageCorver)} type='button' className='absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none border-none hover:shadow-md duration-200 translation-all ease-in-out'>
                            <MdDelete className='text-white' />
                          </button>
                        </div>)
                      }
                    </>
                  )
                }
              </div>
              <div>
                {userImageCorver === null ? (
                  <figure className="relative max-w-sm transition-all duration-300 cursor-pointer filter grayscale hover:grayscale-0">
                    <a>
                      <img className="object-contain h-48 w-96" src={user?.user?.imageURL} alt="image description" />
                    </a>
                  </figure>
                ) : (<></>)}
              </div>
            </htmlForm>
            <button type="button" onClick={submitEdit} className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Edit Profile</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export const FileUploader = ({ updateState, setProgress, isLoading, isImage }) => {
  const [{ editSongs, editArtists, typehtmlForNew, typeAlbumArtistSong, editAlbum, alertType }, dispath] = useStateValue();
  const uploadFile = (e) => {

    isLoading(true);
    const uploadedFile = e.target.files[0];
    const storageRef = ref(storage, `${isImage ? "Images" : "Audio"}/${Date.now()}-${uploadedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, uploadedFile);
    uploadTask.on("state_changed", (snapshot) => {
      setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
    }, (er) => {
      console.log(er);

      dispath({
        type: actionType.SET_ALERT_TYPE,
        alertType: "danger"
      });
      setInterval(() => {
        dispath({
          type: actionType.SET_ALERT_TYPE,
          alertType: null
        });
      }, 4000)

    }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        updateState(downloadURL);
        isLoading(false);
      });
      dispath({
        type: actionType.SET_ALERT_TYPE,
        alertType: "success"
      });
      setInterval(() => {
        dispath({
          type: actionType.SET_ALERT_TYPE,
          alertType: null
        });
      }, 5000)
    })
  }
  return (
    <label>
      <div className='flex flex-col items-center justify-center h-full'>
        <div className='flex flex-col justify-center items-center cursor-pointer'>
          <p className='font-bold text-2xl'>
            <BiCloudUpload />
          </p>
          <p className='text-lg'>Click to upload {isImage ? "an image" : "an audio"}</p>
        </div>
      </div>
      <input type='file' name='upload-file' accept={`${isImage ? "image/*" : "audio/*"}`} className='w-0 h-0' onChange={uploadFile} />
    </label>
  )
}

export const FileLoader = ({ progress }) => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <p className='text-xl font-semibold text-textColor'>
        {Math.round(progress) > 0 && (<>{`${Math.round(progress)}%`}</>)}
      </p>
      <CircularProgress sx={{ display: "flex" }} />
    </div>
  )
}

export default UserProfile