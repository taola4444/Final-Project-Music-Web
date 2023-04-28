import React, { useEffect } from 'react'
import {Header, Music} from './index';
import {UserProfile,Premium,MyFavorite} from '../components/index';
import { Routes, Route } from 'react-router-dom';
import { Contact } from './index';
import {useStateValue} from '../context/StateProvider';

const Home = () => {
  const [{user,isSongPlaying},dispatch] = useStateValue();

  return (
    <div className='w-full h-auto flex flex-col items-center justify-center bg-primary'>
      <Header />
      <div className='my-4 w-full p-4'>
        <Routes>
          <Route path='/userProfile' element={<UserProfile />} />
          <Route path='/premium' element={<Premium />} />
          <Route path='/musics' element={<Music />} />
          <Route path='/myFavorite' element={<MyFavorite />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </div>
    </div>
  )
}

export default Home
