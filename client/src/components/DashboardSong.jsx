import React, { useEffect, useState } from 'react';
import {NavLink} from 'react-router-dom';
import {IoAdd,IoPause,IoPlay,IoTrash} from 'react-icons/io5';
import {AiOutlineClear} from 'react-icons/ai';
import {useStateValue} from '../context/StateProvider';
import {actionType} from "../context/reducer";
import { getAllSong } from '../api';
import {SongCard} from "./index";
import TablePagination from '@mui/material/TablePagination';

const DashboardSong = () => {
  const [songFilter,setSongFilter] = useState("");
  const [isFoucs, setIsFoucs] = useState();
  const [{allSongs,user,typeAlbumArtistSong},dispatch] = useStateValue();

  useEffect(() => {
    if(!allSongs){
      getAllSong().then(data => {
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data?.song
        })
      })
    }
  },[allSongs])

  const clearData = () => {
    setSongFilter("");
  }

  const addSong = () => {
    dispatch({
      type: actionType.SET_TYPE,
      typeForNew: null  
    })
    dispatch({
      type: actionType.SET_EDIT_SONG,
      editSongs: null
    })
    dispatch({
      type: actionType.SET_TYPE_ALBUM_ARTIST_SONG,
      typeAlbumArtistSong: "song"
    })
  }

  const [pageC, setPage] = useState(0);
  const [rowsPerPageC, setRowsPerPage] = useState(12);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  return (
    <div className='w-full p-4 flex items-center justify-center flex-col'>
      <div className='w-full flex justify-center items-center gap-20'>
      {user?.user?.role === "admin" ? (<NavLink onClick={addSong}  to={"/dashboard/newSong"} className='flex items-center justify-center px-4 py-3 border rounded-md border-gray-300 hover:bg-gray-500 hover:shadow-md cursor-pointer'>
          <IoAdd />
        </NavLink>) : ""}

        <input className={`w-52 px-4 py-2 border ${isFoucs ? "border-gray-500 shadow-md" : "border-gray-300"} rounded-md bg-transparent outline-none duration-150 transition-all ease-in-out text-base text-textColor font-semibold`}
        onBlur={() => setIsFoucs(false)} onFocus={() => setIsFoucs(true)}
        type="text" placeholder='Search Song Here...' value={songFilter} onChange={(e) => setSongFilter(e.target.value)} />

        <i>
          <AiOutlineClear onClick={clearData}  className='text-3xl text-textColor cursor-pointer' />
        </i>
      </div>

      {/* Main container */}
      <div className='relative w-full my-4 p-4 py-16 border border-gray-300 rounded-md'>
        {/* The Count */}
        <div className='absolute top-4 left-4'>
          <p className='text-xl font-bold'>
            <span className='text-sm font-semibold text-textColor'>Count :{" "}</span>
            {
              allSongs?.slice(pageC * rowsPerPageC, pageC * rowsPerPageC + rowsPerPageC).filter(p => String(p.name).startsWith(songFilter)).length
            }
          </p>
        </div>
        <SongContainer data={allSongs?.filter(p => String(p.name).startsWith(songFilter))} pageC={pageC} rowsPerPageC={rowsPerPageC} />
        <TablePagination
        rowsPerPageOptions={[6, 12, 24]}
        component="div"
        count={allSongs?.length === undefined ? 0 : allSongs?.length}
        rowsPerPage={rowsPerPageC}
        page={pageC}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </div>
    </div>
  )
}

export const SongContainer = ({data,pageC,rowsPerPageC}) => {
  return (
    <div className='w-full flex flex-wrap gap-3 items-center justify-evenly'>
      {
        data != null ? data && data.slice(pageC * rowsPerPageC, pageC * rowsPerPageC + rowsPerPageC).map((song,i) => (
          <SongCard key={song?._id} data={song} index={i} type="song" page={pageC} rowsPerPage={rowsPerPageC}/>
        )) : ""
      }
    </div>
  )
}

export default DashboardSong