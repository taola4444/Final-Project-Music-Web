import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IoAdd } from 'react-icons/io5';
import { AiOutlineClear } from 'react-icons/ai';
import { useStateValue } from '../context/StateProvider';
import { actionType } from "../context/reducer";
import { getAllSong } from '../api';
import { SongCardMyFavourite } from "./index";
import FilterButtons from "./FilterButtons";
import { filters } from "../utils/supportFuntion";
import TablePagination from '@mui/material/TablePagination';

const Music = () => {
  const [songFilter, setSongFilter] = useState("");
  const [isFoucs, setIsFoucs] = useState();
  const [{ user, allSongs }, dispatch] = useStateValue();
  const [{ filterTerm, searchSong }, dispath] = useStateValue();

  useEffect(() => {
    if (user?.user?.role !== undefined) {
      if (user?.user?.role === "member") {
        getAllSong().then(data => {
          dispatch({
            type: actionType.SET_ALL_SONGS,
            allSongs: data?.song?.filter(p => String(p.role).match("Member"))
          })
        })
      } else {
        getAllSong().then(data => {
          dispatch({
            type: actionType.SET_ALL_SONGS,
            allSongs: data?.song
          })
        })
      }
    }
  }, [user]);

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
  }

  const funcSerach = (e) => {
    dispath({
      type: actionType.SET_SEARCH_SONG,
      searchSong: e
    })
    setSongFilter(e)
  }

  return (
    <div className='w-full p-4 flex items-center justify-center flex-col'>
      <div className='w-full flex justify-center items-center gap-20'>
        {
          user?.user?.role === "admin" ? (<NavLink onClick={addSong} to={"/dashboard/newSong"} className='flex items-center justify-center px-4 py-3 border rounded-md border-gray-300 hover:bg-gray-500 hover:shadow-md cursor-pointer'>
            <IoAdd />
          </NavLink>) : ""
        }

        <input className={`w-52 px-4 py-2 border ${isFoucs ? "border-gray-500 shadow-md" : "border-gray-300"} rounded-md bg-transparent outline-none duration-150 transition-all ease-in-out text-base text-textColor font-semibold`}
          onBlur={() => setIsFoucs(false)} onFocus={() => setIsFoucs(true)}
          type="text" placeholder='Search Here...' value={songFilter} onChange={(e) => funcSerach(e.target.value)} />

        <i>
          <AiOutlineClear onClick={clearData} className='text-3xl text-textColor cursor-pointer' />
        </i>
      </div>

      {/* Main container */}
      <div className='relative w-full my-4 p-4 py-16 border border-gray-300 rounded-md'>
        <div className='absolute top-4 left-4'>
          <div className='flex w-full justify-between flex-wrap items-center gap-4 ml-4'>
            <FilterButtons filterData={filters} flag={"Category"} />
          </div>
        </div>
        <SongContainer data={filterTerm?.toLowerCase() === "all" || filterTerm === null ? allSongs?.filter(p => String(p.name).startsWith(songFilter)) : allSongs?.filter(p => String(p.name).startsWith(songFilter)).filter(p => String(p.category).includes(filterTerm))} />
      </div>
    </div>
  )
}

// allSongs?.filter(p => String(p.role).match("Member")).filter(p => String(p.name).startsWith(songFilter))
export const SongContainer = ({ search, data }) => {
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

  return (
    <>
      <div className='w-full flex flex-wrap gap-3 items-center justify-evenly'>
        {
          data != null ? data && data.slice(pageC * rowsPerPageC, pageC * rowsPerPageC + rowsPerPageC).map((song, i) => (
            <SongCardMyFavourite key={song?._id} data={song} index={i} type="song" pageC={pageC} rowsPerPageC={rowsPerPageC} />
          )) : ""
        }
      </div>
      <TablePagination
        rowsPerPageOptions={[6, 12, 24]}
        component="div"
        count={data?.length === undefined ? 0 : data?.length}
        rowsPerPage={rowsPerPageC}
        page={pageC}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export default Music