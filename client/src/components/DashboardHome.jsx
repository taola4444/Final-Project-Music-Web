import React, { useEffect } from 'react';
import {useStateValue} from '../context/StateProvider';
import {getAllAlbum, getAllArtist, getAllSong, getAllUser} from '../api/index';
import {actionType} from '../context/reducer';
import {FaUsers} from 'react-icons/fa';
import {GiLoveSong,GiMusicalNotes} from 'react-icons/gi';
import {RiUserStarFill} from 'react-icons/ri';
import {bgColors} from '../utils/styles';

export const DashboardCard = ({icon,name,count}) => {

  const bg_Color = bgColors[parseInt(Math.random() * bgColors.length)];

  return (
    <div style={{background: `${bg_Color}`}} className='p-4 w-40 gap-3 h-auto rounded-lg shadow-md bg-blue-400'> 
      {icon}
      <p className='text-xl text-textColor font-semibold'>{name}</p>
      <p className='text-xl text-textColor'>{count}</p>
    </div>
  )
}

const DashboardHome = () => {
  
  const [{allUsers,allSongs,allArtists,allAlbums},dispatch] = useStateValue();
  
  useEffect(() => {
    if(!allUsers){
      getAllUser().then((data) => {
        dispatch({
          type: actionType.SET_ALL_USERS,
          allUsers: data
        })
      })
    }

    if(!allAlbums){
      getAllAlbum().then((data) => {
        dispatch({
          type: actionType.SET_ALL_ALBUMS,
          allAlbums: data
        })
      })
    }

    if(!allArtists){
      getAllArtist().then((data) => {
        dispatch({
          type: actionType.SET_ALL_ARTISTS,
          allArtists: data
        })
      })
    }

    if(!allSongs){
      getAllSong().then((data) => {
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data?.song
        })
      })
    }
  })
  return (
    <div className='w-full p-6 flex items-center justify-evenly flex-wrap'>
      <DashboardCard icon={<FaUsers className='text-3xl text-textColor'/>} name={"Users"} count={allUsers?.data?.length > 0 ? allUsers?.data?.length : 0 } />
      <DashboardCard icon={<GiLoveSong className='text-3xl text-textColor'/>} name={"Songs"} count={allSongs?.length > 0 ? allSongs?.length : 0 }/>
      <DashboardCard icon={<RiUserStarFill className='text-3xl text-textColor'/>} name={"Artists"} count={allArtists?.artist?.length > 0 ? allArtists?.artist?.length : 0 }/>
      <DashboardCard icon={<GiMusicalNotes className='text-3xl text-textColor'/>} name={"Albums"} count={allAlbums?.album?.length > 0 ? allAlbums?.album?.length : 0 }/>
    </div>
  )
}

export default DashboardHome