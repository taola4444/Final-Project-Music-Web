import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate,Routes, Route } from 'react-router-dom';
import {Logo,LogoProfile} from '../assets/img';
import {isActiveStyles,isNotActiveStyles} from '../utils/styles';
import {FaCrown} from 'react-icons/fa';
import {useStateValue} from '../context/StateProvider';
import { getAuth,signOut  } from 'firebase/auth';
import {app} from '../config/firebase';
import {motion} from 'framer-motion';
import { actionType } from '../context/reducer';

const Header = () =>{
    const [{user,isSongPlaying},dispatch] = useStateValue();
    const [isMenu, setIsMenu] = useState(false);

    const navigate = useNavigate();

    const logOut = () => {
        const firebaseAuth = getAuth(app);
        firebaseAuth.signOut().then(() => {
            window.localStorage.removeItem("auth");
            dispatch({
                type: actionType.SET_ALL_SONGS,
                allSongs: null
              })
            navigate("/login",{replace: true})
        }).catch((e) => {
            console.log(e);
            navigate("/login",{replace: false})
        })
        // const auth = getAuth();
        // signOut(auth).then(() => {
        //     window.localStorage.removeItem("auth");
        //     dispatch({
        //         type: actionType.SET_ALL_SONGS,
        //         allSongs: null
        //       })
        //     navigate("/login",{replace: true})
        // }).catch((error) => {
        //     console.log(error);
        //     navigate("/login",{replace: false})
        // });
    }

  return (
    <header className='flex items-center w-full p-4 md:py-2 md:px-6 border border-l-rose-300 '>
        <NavLink to={"/"}>
            <img src={Logo} alt="Photo" className='w-16'/>
        </NavLink>

        {
            user?.user?.role === "admin" ? (
            <ul className='flex items-center justify-center ml-7'>
                <li className='mx-5 text-lg'><NavLink className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles} to={'/'}>Home</NavLink></li>
            </ul>
            ) : (
            <ul className='flex items-center justify-center ml-7'>
                <li className='mx-5 text-lg'><NavLink className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles} to={'/'}>Home</NavLink></li>
                <li className='mx-5 text-lg'><NavLink className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles} to={'/musics'}>Musics</NavLink></li>
                <li className='mx-5 text-lg'><NavLink className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles} to={'/premium'}>Premium</NavLink></li>
                <li className='mx-5 text-lg'><NavLink className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles} to={'/contact'}>Contact</NavLink></li>
            </ul>
            )
        }

        <div onMouseEnter={() => setIsMenu(true)} onMouseLeave={() => setIsMenu(false)} className='flex items-center ml-auto cursor-pointer gap-2 relative'>
            <img src={user?.user?.imageURL} className='w-12 h-12 min-w-[44px] object-cover rounded-full shadow-lg' alt='' referrerPolicy='no-referrer'/>
            <div className='flex flex-col'>
                <p className='text-textColor text-lg hover:text-headingColor font-semibold'>{user?.user?.name?.length > 20 ? user?.user?.name?.slice(0,20) + "..." : user?.user?.name}</p>
                <p className='flex items-center gap-2 text-xs text-gray-500 font-normal'>{user?.user?.role === "admin" ? "Admin" : user?.user?.role === "member" ? "Member" : `Premiup Member. `}{user?.user?.role === "premium" ? <FaCrown className='text-sm -ml-1 text-yellow-500'/> : ""}</p>
            </div>

            {isMenu && (
                <motion.div initial={{opacity: 0, y: 50}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 50}} className='absolute z-10 p-4 top-12 right-0 w-275 gap-4 bg-card shadow-lg rounded-lg backdrop-blur-sm flex flex-col'>
                    <NavLink to={'/userProfile'}>
                        <p className='text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out'>Profile</p>
                    </NavLink>
                    {
                        user?.user?.role === "admin" ? (<></>) : (
                            <NavLink to={'/myFavorite'}>
                            <p className='text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out'>My Favourites</p>
                            </NavLink>
                        )
                    }
                    <hr />
                    {
                        user?.user?.role === "admin" && (
                            <NavLink to={'/dashboard/home'}>
                                <p className='text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out'>Dashboard</p>
                            </NavLink>
                        )
                    }
                    <p onClick={logOut} className='text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out'>Sign Out</p>
                </motion.div>
            )}
        </div>
    </header>
  )
}

export default Header
