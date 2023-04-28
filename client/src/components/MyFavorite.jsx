import React, { useEffect, useState } from 'react'
import { getUserFavorite,getMyFavourite,getAllSong } from '../api';
import {useStateValue} from '../context/StateProvider';
import {actionType} from "../context/reducer";
import SongCardMyFavourite from './SongCardMyFavourite';
import TablePagination from '@mui/material/TablePagination';

const MyFavorite = () => {
  const [{user,isSongPlaying,allSongs},dispath] = useStateValue();
  
  useEffect(() => {
    if(user?.user?._id !== undefined){
      if(user?.user?.role === "member"){
        getUserFavorite(user?.user?._id).then(res => {
          getAllSong().then(data => {
            dispath({
              type: actionType.SET_ALL_SONGS,
              allSongs: funCompare(data?.song,res?.data?.favourites).filter(p => String(p.role).match("Member"))
            });
          })
        })
      }else{
        getUserFavorite(user?.user?._id).then(res => {
          getAllSong().then(data => {
            dispath({
              type: actionType.SET_ALL_SONGS,
              allSongs: funCompare(data?.song,res?.data?.favourites)
            });
          })
        })
    }
    }
  },[user]);

  const funCompare = (arr1,arr2) => {
    return arr1?.filter((elem) => {
      return arr2.some((ele) => {
      return ele.song_id === elem._id;
        });
      });
  }
  console.log(allSongs);

  return (
    <div>
      <SongFavourite data={allSongs} />
    </div>
  )
}

export const SongFavourite = ({data}) => {
  const [pageC, setPage] = useState(0);
  const [rowsPerPageC, setRowsPerPage] = useState(12);
  const [{page,rowsPerPage},dispath] = useStateValue();

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
  },[pageC,rowsPerPageC]);
  return (
    <>
      <div className='w-full flex flex-wrap gap-3 items-center justify-evenly'>
      {
        data != null ? data && data.slice(pageC * rowsPerPageC, pageC * rowsPerPageC + rowsPerPageC).map((song,i) => (
          <SongCardMyFavourite key={song?._id} data={song} index={i} type="song" page={"favourite"} pageC={pageC} rowsPerPageC={rowsPerPageC}/>
        )) : ""
      }
    </div>
      <div>
        {data?.length === 0 ? (<></>) : <TablePagination
          rowsPerPageOptions={[6, 12, 24]}
          component="div"
          count={data?.length}
          rowsPerPage={rowsPerPageC}
          page={pageC}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />}
      </div>
    </>
  )
}

export default MyFavorite
