import React, { useState } from 'react';
import {motion} from 'framer-motion';
import {IoTrash,IoPencil} from 'react-icons/io5';
import { deleteAlbum, deleteSong,getAllSong,getAllArtist, getAllAlbum, deleteArtist,addFavourite,removeFavourite } from '../api';
import {useStateValue} from '../context/StateProvider';
import {actionType} from "../context/reducer";
import { deleteObject, ref } from 'firebase/storage';
import { storage } from '../config/firebase';
import { NavLink } from 'react-router-dom';

const SongCard = ({data,index,type,page,rowsPerPage}) => {
  const [isDelete,setIsDelete] = useState(false);
  const [{user,alertType,allSongs,allArtists,allAlbums,songIndex,isSongPlaying,typeForNew,editSongs,typeAlbumArtistSong,editArtists,editAlbum},dispath] = useStateValue();

  
  const deleteObj = (data) => {
    const deleteRef = ref(storage,data?.imageURL);

    if(type === "song"){  
      const deleteAdio = ref(storage,data?.songURL);

      deleteObject(deleteRef).then(() => {});
      deleteObject(deleteAdio).then(() => {});

      deleteSong(data._id).then(res => {
          if(res.data){
            dispath({
              type: actionType.SET_ALERT_TYPE,
              alertType: "success"
            });
            setInterval(() => {
              dispath({
                type: actionType.SET_ALERT_TYPE,
                alertType: null
              });
            },5000)
          }else{
            dispath({
              type: actionType.SET_ALERT_TYPE,
              alertType: "danger"
            });
            setInterval(() => {
              dispath({
                type: actionType.SET_ALERT_TYPE,
                alertType: null
              });
            },5000)
          }
          getAllSong().then((data) => {
            dispath({
              type: actionType.SET_ALL_SONGS,
              allSongs: data?.song
            })
          })
      })
    }

    if(type === "album"){

      deleteAlbum(data._id).then(res => {
        deleteObject(deleteRef).then(() => {});
          if(res.data){
            dispath({
              type: actionType.SET_ALERT_TYPE,
              alertType: "success"
            });
            setInterval(() => {
              dispath({
                type: actionType.SET_ALERT_TYPE,
                alertType: null
              });
            },5000)
          }else{
            dispath({
              type: actionType.SET_ALERT_TYPE,
              alertType: "danger"
            });
            setInterval(() => {
              dispath({
                type: actionType.SET_ALERT_TYPE,
                alertType: null
              });
            },5000)
          }
          getAllAlbum().then((data) => {
            dispath({
              type: actionType.SET_ALL_ALBUMS,
              allAlbums: data
            })
          })
      })
    }

    if(type === "artist"){
      deleteArtist(data._id).then(res => {
        deleteObject(deleteRef).then(() => {});
          if(res.data){
            dispath({
              type: actionType.SET_ALERT_TYPE,
              alertType: "success"
            });
            setInterval(() => {
              dispath({
                type: actionType.SET_ALERT_TYPE,
                alertType: null
              });
            },5000)
          }else{
            dispath({
              type: actionType.SET_ALERT_TYPE,
              alertType: "danger"
            });
            setInterval(() => {
              dispath({
                type: actionType.SET_ALERT_TYPE,
                alertType: null
              });
            },5000)
          }
          getAllArtist().then((data) => {
            dispath({
              type: actionType.SET_ALL_ARTISTS,
              allArtists: data
            })
          })
      })
    }
  }

  const editFunc = (data) => {
    if(type === "song"){
      dispath({
        type: actionType.SET_EDIT_SONG,
        editSongs: data
      })
    }

    dispath({
      type: actionType.SET_TYPE,
      typeForNew: "Edit"
    })

    dispath({
      type: actionType.SET_TYPE_ALBUM_ARTIST_SONG,
      typeAlbumArtistSong: type
    })

    if(type === "artist"){
      dispath({
        type: actionType.SET_EDIT_ARTIST,
        editArtists: data
      })
    }

    if(type === "album"){
      dispath({
        type: actionType.SET_EDIT_ALBUM,
        editAlbum: data
      })
    }
  } 
  
  return (
    <motion.div className='relative w-40 min-w-210 px-2 py-4 cursor-pointer hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center'>
      <div className='w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden'>
        <motion.img whileHover={{scale: 1.05}} src={data?.imageURL} className='w-full h-full rounded-lg object-cover'/>
      </div>
      <p className='text-base text-center text-headingColor font-semibold my-2'>{data?.name?.length > 15 ? `${data?.name.slice(0,15)}..` : data?.name}</p>
      {data.artist && (
        <span className='block text-sm text-gray-400'>{data?.artist?.length > 15 ? `${data?.artist.slice(0,15)}....` : data?.artist}</span>
      )}
      {
        user?.user?.role === "admin" ? (<div className='w-full absolute bottom-2 right-2 flex items-center justify-between px-4'>
        <motion.i onClick={() => setIsDelete(true)} whiletap={{scale: 0.75}} className='text-base text-red-400 drop-shadow-md hover:text-red-600'>
            <IoTrash />
        </motion.i>
      </div>) : ""
      }
      {
        user?.user?.role === "admin" ? (<div className='w-50 absolute bottom-2 right-2 flex items-center justify-between'>
        <NavLink to={"/dashboard/newSong"} onClick={() => editFunc(data)} whiletap={{scale: 0.75}} className='text-base text-red-400 drop-shadow-md hover:text-red-600'>
            <IoPencil />
        </NavLink>
      </div>) : ""
      }
      {
        isDelete && (
          <motion.div className='absolute inset-0 backdrop-blur-md bg-cardOverlay flex items-center flex-col justify-center px-4 py-2 gap-0'
        initial={{opacity: 0}} animate={{opacity: 1}}
      >
          <p className='text-lg text-headingColor font-semibold text-center'>Are you sure do you want to delete it?</p>
          <div className='flex items-center gap-4'>
            <motion.button onClick={() => deleteObj(data)} whiletap={{scale: 0.7}} className='px-2 py-1 text-sm uppercase bg-red-400 rounded-md hover:bg-red-500 cursor-pointer'>Yes</motion.button>
            <motion.button onClick={() => setIsDelete(false)} whiletap={{scale: 0.7}} className='px-2 py-1 text-sm uppercase bg-green-300 rounded-md hover:bg-green-500 cursor-pointer'>No</motion.button>
          </div>
      </motion.div>
        )
      } 
    
    </motion.div>
  )
}

export default SongCard
