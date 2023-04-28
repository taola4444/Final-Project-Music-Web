import React from 'react';
import { NavLink,Routes, Route } from 'react-router-dom';
import Header from './Header';
import {IoHome} from "react-icons/io5";
import { isActiveStyles,isNotActiveStyles } from '../utils/styles';
import {DashboardHome,DashboardUser,DashboardSong,DashboardArtist,DashboardAlbum,DashboardNewSong, Alert,DashboardProfit} from './index';
import { useStateValue } from '../context/StateProvider';

const Dashboard = () => {
  const [{alertType},dispath] = useStateValue();
  return (
    <div className='w-full h-auto flex flex-col items-center justify-center bg-primary'>
      <Header />
      <div className='w-[60%] my-2 p-4 flex items-center justify-evenly'>
          <NavLink to={"/dashboard/home"}><IoHome className='text-2xl text-textColor' /></NavLink>
          <NavLink to={"/dashboard/user"} className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles}>Users</NavLink>
          <NavLink to={"/dashboard/songs"} className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles}>Songs</NavLink>
          <NavLink to={"/dashboard/artist"} className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles}>Artists</NavLink>
          <NavLink to={"/dashboard/albums"} className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles}>Albums</NavLink>
          <NavLink to={"/dashboard/profit"} className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles}>Profit</NavLink>
      </div>

      <div className='my-4 w-full p-4'>
        <Routes>
          <Route path='/home' element={<DashboardHome />} />
          <Route path='/user' element={<DashboardUser />} />
          <Route path='/songs' element={<DashboardSong />} />
          <Route path='/artist' element={<DashboardArtist />} />
          <Route path='/albums' element={<DashboardAlbum />} />
          <Route path='/profit' element={<DashboardProfit />} />
          <Route path='/newSong' element={<DashboardNewSong />} />
        </Routes>
      </div>
      {
        alertType && (
          <Alert type={alertType} />
        )
      }
    </div>
  )
}

export default Dashboard
