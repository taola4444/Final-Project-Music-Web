import React, { useEffect, useState } from 'react';
import {motion} from 'framer-motion';
import {AiFillHeart,AiOutlineHeart} from 'react-icons/ai';
import { addFavourite, removeFavourite } from '../api';
import {useStateValue} from '../context/StateProvider';
import {actionType} from "../context/reducer";

const SongCardMyFavourite = ({data,index,type,pageC,rowsPerPageC}) => {
  const [{user,allSongs,songIndex,isSongPlaying,page,rowsPerPage},dispath] = useStateValue();
  const unique = [...new Set(user?.user?.favourites.map(item => item.song_id))]; 

  const addToContext = () => {
    if(!page){
      dispath({
        type: actionType.SET_ROW_PAGE,
        page: pageC
      })
    }

    if(!rowsPerPage){
      dispath({
        type: actionType.SET_ROWS_PER_PAGE,
        rowsPerPage: rowsPerPageC
      })
    }
    if(!isSongPlaying){
      dispath({
        type: actionType.SET_ISSONG_PLAYING,
        isSongPlaying: true
      })
    }

    if(songIndex !== index ) {
      dispath({
        type: actionType.SET_SONG_INDEX,
        songIndex: index
      })
    }

  }

  const addToNull = () => {}

  const unlikeFavorite = (data) => {
    removeFavourite(user?.user?._id,data?._id).then((res) => {
      if(res.status === 200){
        window.location.reload(false);
      }
    })
  }
  const likeFavorite = (data) => {
    addFavourite(user?.user?._id,data?._id).then((res) => {
      if(res.status === 200){
        window.location.reload(false);
      }
    })
  }

  return (
    <motion.div className='relative w-40 min-w-210 px-2 py-4 cursor-pointer hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center'>
      <div className='w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden'>
        <motion.img onClick={type === "song" ? addToContext : addToNull} whileHover={{scale: 1.05}} src={data?.imageURL} className='w-full h-full rounded-lg object-cover'/>
      </div>
      <p className='text-base text-center text-headingColor font-semibold my-2'>{data?.name?.length > 15 ? `${data?.name.slice(0,15)}..` : data?.name}</p>
      {data.artist && (
        <span className='block text-sm text-gray-400'>{data?.artist?.length > 15 ? `${data?.artist.slice(0,15)}....` : data?.artist}</span>
      )} 
      {
        unique.find(song_id => song_id === data?._id) ? <AiFillHeart style={{color: "red"}} className='hover:bg-slate-300' onClick={() => unlikeFavorite(data)} /> : 
        <AiOutlineHeart className='hover:text-red-500' onClick={() => likeFavorite(data)} />
      }
    
    </motion.div>
  )
}



export default SongCardMyFavourite
