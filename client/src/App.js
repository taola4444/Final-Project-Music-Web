import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Login,Home, Register, MusicPlayer,PageHome } from './components';
import {app} from './config/firebase';
import {getAuth} from 'firebase/auth';
import {AnimatePresence, motion} from 'framer-motion';
import {validateUser} from './api/index';
import { useStateValue } from './context/StateProvider';
import { actionType } from './context/reducer';
import {Dashboard,ForgotPassword} from './components/index';

const App = () => {
  const firebaseAuth = getAuth(app);
  const navigate = useNavigate();

  const [{user,isSongPlaying},dispatch] = useStateValue();

  const [auth, setAuth] = useState(false || window.localStorage.getItem("auth") === true);

  useEffect(() => {
      firebaseAuth.onAuthStateChanged((res) => {
        if(res){
          res.getIdToken().then((token) => {
            validateUser(token).then((data) => {
              dispatch({
                type: actionType.SET_USER,
                user: data
              })
            });
          })
        }else{
          setAuth(false);
          window.localStorage.setItem("auth","false");
          dispatch({
            type: actionType.SET_USER,
            user: null
          })
          navigate("/login");
        }
      })
  },[])

  return (
    <AnimatePresence>
      <div className='h-full min-w-[680px] flex justify-center items-center'>
        <Routes>
          <Route path='/login' element={<Login setAuth={setAuth} />} />
          <Route path='/*' element={<Home />} />
          <Route path='/' element={<PageHome />} />
          <Route path='/dashboard/*' element={<Dashboard />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgotPassword' element={<ForgotPassword />} />
        </Routes>
        {
          isSongPlaying && (
            <motion.div
              initial={{opacity: 0, y: 50}}
              animate={{opacity: 1,y: 0}}
              className={`fixed min-w-[700px] h-26 inset-x-0 bottom-0 bg-cardOverlay drop-shadow-2xl backdrop-blur-md flex items-center justify-center`}
            >
              <MusicPlayer />
            </motion.div>
          )
        }
      </div>
    </AnimatePresence>
  )
}

export default App
