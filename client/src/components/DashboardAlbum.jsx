import React, { useEffect, useState } from 'react';
import { useStateValue } from '../context/StateProvider';
import { getAllAlbum } from '../api';
import { actionType } from '../context/reducer';
import { SongCard } from './index';
import TablePagination from '@mui/material/TablePagination';
import { NavLink } from 'react-router-dom';
import { IoAdd } from 'react-icons/io5';
import {AiOutlineClear} from 'react-icons/ai';

const DashboardAlbum = () => {
  const [{ allAlbums,typeAlbumArtistSong,user }, dispatch] = useStateValue();
  const [albumFilter, setAlbumFilter] = useState("");
  const [isFoucs, setIsFoucs] = useState();
  const [pageC, setPage] = useState(0);
  const [rowsPerPageC, setRowsPerPage] = useState(12);
  const [{ page, rowsPerPage }, dispath] = useStateValue();

  const handleChangePage = (event, newPage) => {
    dispath({
      type: actionType.SET_ROW_PAGE,
      page: newPage
    })
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    dispath({
      type: actionType.SET_ROW_PAGE,
      page: 0
    })

    dispath({
      type: actionType.SET_ROWS_PER_PAGE,
      rowsPerPage: +event.target.value
    })
  };

  useEffect(() => {
    if (!page) {
      dispath({
        type: actionType.SET_ROW_PAGE,
        page: pageC
      })
    }

    if (!rowsPerPage) {
      dispath({
        type: actionType.SET_ROWS_PER_PAGE,
        rowsPerPage: rowsPerPageC
      })
    }
  }, [pageC, rowsPerPageC]);
  useEffect(() => {
    if (!allAlbums) {
      getAllAlbum().then((data) => {
        dispatch({
          type: actionType.SET_ALL_ALBUMS,
          allAlbums: data
        })
      })
    }
  }, []);

  const addAlbum = () => {
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
      typeAlbumArtistSong: "album"
    })
  }
    
  const clearData = () => {
    setAlbumFilter("");
  }

  return (
    <div className='w-full p-4 flex items-center justify-center flex-col'>
      <div className='w-full flex justify-center items-center gap-20'>
        {user?.user?.role === "admin" ? (<NavLink onClick={addAlbum} to={"/dashboard/newSong"} className='flex items-center justify-center px-4 py-3 border rounded-md border-gray-300 hover:bg-gray-500 hover:shadow-md cursor-pointer'>
          <IoAdd />
        </NavLink>) : ""}
        <input className={`w-52 px-4 py-2 border ${isFoucs ? "border-gray-500 shadow-md" : "border-gray-300"} rounded-md bg-transparent outline-none duration-150 transition-all ease-in-out text-base text-textColor font-semibold`}
          onBlur={() => setIsFoucs(false)} onFocus={() => setIsFoucs(true)}
          type="text" placeholder='Search Album Here...' value={albumFilter} onChange={(e) => setAlbumFilter(e.target.value)} />
        <i>
          <AiOutlineClear onClick={clearData}  className='text-3xl text-textColor cursor-pointer' />
        </i>
      </div>
      <div className='relative w-full my-4 p-4 py-16 border border-gray-300 rounded-md'>
      <div className='absolute top-4 left-4'>
          <p className='text-xl font-bold'>
            <span className='text-sm font-semibold text-textColor'>Count :{" "}</span>
            {
              allAlbums?.album?.slice(pageC * rowsPerPageC, pageC * rowsPerPageC + rowsPerPageC).filter(p => String(p.name).startsWith(albumFilter)).length
            }
          </p>
        </div>
        <AlbumsContainer data={allAlbums?.album?.filter(p => String(p.name).startsWith(albumFilter))} pageC={pageC} rowsPerPageC={rowsPerPageC} />
        <TablePagination
          rowsPerPageOptions={[6, 12, 24]}
          component="div"
          count={allAlbums?.album?.length === undefined ? 0 : allAlbums?.album?.length}
          rowsPerPage={rowsPerPageC}
          page={pageC}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  )
}

export const AlbumsContainer = ({ data,pageC,rowsPerPageC }) => {
  return (
    <>
      <div className='w-full flex flex-wrap gap-3 items-center justify-evenly'>
        {
          data != null ? data.slice(pageC * rowsPerPageC, pageC * rowsPerPageC + rowsPerPageC).map((album, i) => (
            <SongCard key={album?._id} data={album} index={i} type="album" />
          )) : ""
        }
      </div>
    </>
  )
}

export default DashboardAlbum
