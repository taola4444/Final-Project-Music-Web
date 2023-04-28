import React, { useEffect, useId, useState } from 'react'
import { useStateValue } from '../context/StateProvider';
import {motion} from 'framer-motion';
import moment from 'moment';
import {changeingUserRole, getAllUser,removeUser,deleteUserFirebase} from '../api/index';
import {actionType} from "../context/reducer";
import {MdDelete} from 'react-icons/md';
import {LogoProfile} from '../assets/img';
import TablePagination from '@mui/material/TablePagination';
import { getAuth, deleteUser } from "firebase/auth";

export const DashboardUserCard = ({data,index}) => {
  const [{user,allUsers},dispatch] = useStateValue();
  const [isUserRoleUpdate,setisUserRoleUpdate] = useState(false);
  const createdAt = moment(new Date(data.createdAt)).format("MMMM Do YYYY");

  useEffect(() => {
    if(!allUsers){
      getAllUser().then((data) => {
        dispatch({
          type: actionType.SET_ALL_USERS,
          allUsers: data
        })
      })
    }
  },[])

  const updateUserRole = (userId,role) => {
    changeingUserRole(userId,role).then((res) => {
      if(res){
        getAllUser().then((data) => {
          dispatch({
            type: actionType.SET_ALL_USERS,
            allUsers: data
          });
          setisUserRoleUpdate(false)
        })
      }
    })
  }

  const deleteUserData = async (id,user_id) => {
    removeUser(id).then((res) => {
      deleteUserFirebase(user_id).then((res) => {
        console.log(res);
        if(res){
          getAllUser().then((data) => {
            dispatch({
              type: actionType.SET_ALL_USERS,
              allUsers: data
            });
            setisUserRoleUpdate(false)
          })
        }
      })
    })
  }

  return (
    <motion.div key={index} className='relative w-full rounded-md flex items-center justify-between py-4 bg-lightOverlay cursor-pointer hover:bg-card hover:shadow-md'>
        {
          data._id !== user?.user?._id && (
            <motion.div onClick={() => deleteUserData(data._id,data.user_id)} whileTap={{scale: 0.75}} className='absolute left-4 w-8 h-8 rounded-md flex items-center justify-center bg-gray-200'>
                  <MdDelete className='text-xl text-red-400 hover:text-red-500' />
            </motion.div>
          )
        }
        
        {/* user image */}
        <div className='w-275 min-w-[160px] flex items-center justify-center'>
          <img src={data?.imageURL?.search("@") === -1 ? data.imageURL : LogoProfile} alt='' referrerPolicy='no-referrer' className='w-10 h-10 object-cover rounded-md min-w-[40px] shadow-md' />
        </div>

        {/* user name */}
        <p className='text-base text-textColor w-257 min-w-[160px] text-center'>{data.name}</p>
        <p className='text-base text-textColor w-257 min-w-[160px] text-center'>{data.email}</p>
        <p className='text-base text-textColor w-257 min-w-[160px] text-center'>{data.email_verified === true ? "true" : "false"}</p>
        <p className='text-base text-textColor w-257 min-w-[160px] text-center'>{createdAt}</p>

        <div className='w-275 min-w-[160px] text-center flex items-center justify-center gap-6 relative'>
          <p className='text-base text-textColor text-center'>{data.role}</p>

          {
            data._id !== user?.user?._id && (
              <motion.p whileTap={{scale: 0.75}} className='text-[10px] font-semibold text-textColor px-1 bg-purple-200 rounded-sm hover:shadow-md' onClick={() => setisUserRoleUpdate(true)}>
              {data.role === "admin" ? "Member" : "Admin"}
            </motion.p>
            )
          }

          {
            isUserRoleUpdate && (
              <motion.div initial={{opacity: 0 , scale: 0.5}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.5}} className='absolute z-10 top-6 right-4 p-4 flex items-start flex-col gap-4 bg-white shadow-xl rounded-md'>
            <p className='text-textColor text-[12px] font-semibold'>
              Are you sure want change user to 
              <span>{data.role === "admin" ? " Member" : " Admin"}</span>
            </p>
            <div className='flex items-center gap-4 ml-14'>
                <motion.button onClick={() => updateUserRole(data._id,data.role === "admin" ? "member" : "admin")} whileTap={{scale : 0.75}} className='outline-none border-none text-sm px-4 py-1 rounded-md bg-blue-200 text-black hover:shadow-md'>
                  Yes
                </motion.button>

                <motion.button onClick={() => setisUserRoleUpdate(false)} whileTap={{scale : 0.75}} className='outline-none border-none text-sm px-4 py-1 rounded-md bg-gray-200 text-black hover:shadow-md'>
                  No
                </motion.button>
            </div>
          </motion.div>
            )
          }

        </div>
    </motion.div>
  )
}
const DashboardUser = () => {
  const [{allUsers,page, rowsPerPage},dispatch] = useStateValue();
  const [pageC, setPage] = useState(0);
  const [rowsPerPageC, setRowsPerPage] = useState(12);

  const handleChangePage = (event, newPage) => {
    dispatch({
      type: actionType.SET_ROW_PAGE,
      page: newPage
    })
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    dispatch({
      type: actionType.SET_ROW_PAGE,
      page: 0
    })

    dispatch({
      type: actionType.SET_ROWS_PER_PAGE,
      rowsPerPage: +event.target.value
    })
  };

  useEffect(() => {
    if(!allUsers){
      getAllUser().then((data) => {
        dispatch({
          type: actionType.SET_ALL_USERS,
          allUsers: data
        })
      })
    }
  },[])

  return (
    <div className='w-full p-4 flex items-center justify-center flex-col'>
        <div className='relative w-full py-12 min-h-[400] overflow-x-scroll my-4 flex flex-col items-center justify-start p-4 border border-gray-300 rounded-md gap-3'>
            <div className='absolute top-4 left-4'>
              <p className='text-xl font-bold'>
                Count <span className='text-sm font-bold text-textColor'>{allUsers?.data?.slice(pageC * rowsPerPageC, pageC * rowsPerPageC + rowsPerPageC).length}</span>
              </p>
            </div>


            <div className='w-full min-w-[750px] flex items-center justify-between'>
              <p className='text-sm text-textColor font-semibold w-275 min-w-[160px] text-center'>Image</p>
              <p className='text-sm text-textColor font-semibold w-275 min-w-[160px] text-center'>Name</p>
              <p className='text-sm text-textColor font-semibold w-275 min-w-[160px] text-center'>Email</p>
              <p className='text-sm text-textColor font-semibold w-275 min-w-[160px] text-center'>Verified</p>
              <p className='text-sm text-textColor font-semibold w-275 min-w-[160px] text-center'>Created</p>
              <p className='text-sm text-textColor font-semibold w-275 min-w-[160px] text-center'>Role</p>
            </div>
        </div>

        {
          allUsers?.data && (
            allUsers?.data?.slice(pageC * rowsPerPageC, pageC * rowsPerPageC + rowsPerPageC).map((data,i) => (
              <DashboardUserCard key={i} data={data} index={i} />
            )) 
          )
        }

        <div className='ml-auto'>
        <TablePagination
          rowsPerPageOptions={[6, 12, 24]}
          component="div"
          count={allUsers?.data?.length === undefined ? 0 : allUsers?.data?.length}
          rowsPerPage={rowsPerPageC}
          page={pageC}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </div>
      
    </div>
  )
}

export default DashboardUser
