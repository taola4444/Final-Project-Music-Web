import React, { useEffect } from 'react';
import { storage } from '../config/firebase';
import { useStateValue } from '../context/StateProvider';
import { actionType } from '../context/reducer';
import { getAllAlbum, getAllArtist, getAllSong, saveNewSong, saveNewArtist, saveNewAlbum, editSong, editArtist, editAlbumApi } from '../api';
import { useState } from 'react';
import FilterButtons from "./FilterButtons";
import { filters, filterByLanguage, role } from "../utils/supportFuntion";
import { BiCloudUpload } from 'react-icons/bi';
import CircularProgress from '@mui/material/CircularProgress';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { MdDelete } from 'react-icons/md';
import LoadingButton from '@mui/lab/LoadingButton';
import { IoSave } from 'react-icons/io5';
import { useNavigate } from "react-router-dom";

const DashboardNewSong = () => {
  const [songName, setsongName] = useState();
  const [{ roleFilter, allArtists, allAlbums, artistFilter, albumFilter, filterTerm, languageFilter, editSongs, typeForNew, typeAlbumArtistSong, editArtists, editAlbum }, dispath] = useStateValue();
  const [songImageCover, setSongImageCover] = useState(null);
  const [isImageLoading, setisImageLoading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const navigate = useNavigate();
  // Variable audio
  const [audioImageCover, setAudioImageCover] = useState(null);
  const [audioUploadingProgree, setaudioUploadingProgree] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  // Image Artist
  const [artistImageCover, setArtistImageCover] = useState(null);
  const [artistUploadingProgress, setArtistUploadingProgress] = useState(0);
  const [isArtistUpLoading, setIsArtistUpLoading] = useState(false);
  const [artistName, setArtistName] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  // Image Album
  const [albumImageCover, setAlbumImageCover] = useState(null);
  const [albumUploadingProgress, setAlbumUploadingProgress] = useState(0);
  const [isAlbumUpLoading, setIsAlbumUpLoading] = useState(false);
  const [albumName, setAlbumName] = useState("");

  useEffect(() => {
    if (!allArtists) {
      getAllArtist().then((data) => {
        dispath({
          type: actionType.SET_ALL_ARTISTS,
          allArtists: data
        })
      })
    }

    if (!allAlbums) {
      getAllAlbum().then((data) => {
        dispath({
          type: actionType.SET_ALL_ALBUMS,
          allAlbums: data
        })
      })
    }

    if (!editSongs) {
      dispath({
        type: actionType.SET_EDIT_SONG,
        editSongs: editSongs
      })
    }

    if (!typeForNew) {
      dispath({
        type: actionType.SET_TYPE,
        typeForNew: typeForNew
      })
    }

    if (!editArtists) {
      dispath({
        type: actionType.SET_EDIT_ARTIST,
        editArtists: editArtists
      })
    }

    if (!editAlbum) {
      dispath({
        type: actionType.SET_EDIT_ALBUM,
        editAlbum: editAlbum
      })
    }
  }, [])

  const deleteFileObj = (url, isImage) => {
    const deleteRef = ref(storage, url);

    if (isImage) {
      setisImageLoading(true);
      deleteObject(deleteRef).then(() => {
        setSongImageCover(null);
        setisImageLoading(false);
      });
    } else {
      setIsAudioLoading(true);
      deleteObject(deleteRef).then(() => {
        setAudioImageCover(null);
        setIsAudioLoading(false);
      });
    }

    dispath({
      type: actionType.SET_ALERT_TYPE,
      alertType: "success"
    });
    setInterval(() => {
      dispath({
        type: actionType.SET_ALERT_TYPE,
        alertType: null
      });
    }, 4000)
  }

  const deleteFileArtistandAlbum = (url, flag) => {
    const deleteRef = ref(storage, url);

    if (flag === "album") {
      setIsAlbumUpLoading(true);
      deleteObject(deleteRef).then(() => {
        setAlbumImageCover(null);
        setIsAlbumUpLoading(false);
      });
    } else {
      setIsArtistUpLoading(true);
      deleteObject(deleteRef).then(() => {
        setArtistImageCover(null);
        setIsArtistUpLoading(false);
      });
    }

    dispath({
      type: actionType.SET_ALERT_TYPE,
      alertType: "success"
    });
    setInterval(() => {
      dispath({
        type: actionType.SET_ALERT_TYPE,
        alertType: null
      });
    }, 4000)
  }
  // Save song
  const saveSong = () => {
    if (!songImageCover || !audioImageCover) {
      dispath({
        type: actionType.SET_ALERT_TYPE,
        alertType: "danger"
      });
      setInterval(() => {
        dispath({
          type: actionType.SET_ALERT_TYPE,
          alertType: null
        });
      }, 4000)
    } else {
      setIsAudioLoading(true);
      setisImageLoading(true);

      const data = {
        name: songName,
        imageURL: songImageCover,
        songURL: audioImageCover,
        album: albumFilter,
        artist: artistFilter,
        language: languageFilter,
        category: filterTerm,
        role: roleFilter
      }

      saveNewSong(data).then(res => {
        if (res.status === 200) {
          getAllSong().then(songs => {
            dispath({
              type: actionType.SET_ALL_SONGS,
              allSongs: songs.data
            })
          });
        }
      })

      dispath({
        type: actionType.SET_ALERT_TYPE,
        alertType: "success"
      });
      setInterval(() => {
        dispath({
          type: actionType.SET_ALERT_TYPE,
          alertType: null
        });
      }, 4000)

      setsongName(null);
      setIsAudioLoading(false);
      setisImageLoading(false);
      setSongImageCover(null);
      setAudioImageCover(null);
      setsongName("");
      dispath({ type: actionType.SET_ARTIST_FILTER, artistFilter: null });
      dispath({ type: actionType.SET_LANGUAGE_FILTER, languageFilter: null });
      dispath({ type: actionType.SET_ALBUM_FILTER, albumFilter: null });
      dispath({ type: actionType.SET_FILTER_TERM, filterTerm: null });
      dispath({ type: actionType.SET_FILTER_ROLE, roleFilter: null });
    }
  }
  // Save artist
  const saveArtist = () => {
    if (!artistImageCover || !artistName || !twitter || !instagram) {
      dispath({
        type: actionType.SET_ALERT_TYPE,
        alertType: "danger"
      });
      setInterval(() => {
        dispath({
          type: actionType.SET_ALERT_TYPE,
          alertType: null
        });
      }, 4000)
    } else {
      setIsArtistUpLoading(true);
      const data = {
        name: artistName,
        imageURL: artistImageCover,
        twitter: `www.twitter.com/${twitter}`,
        instagram: `www.instagram.com/${instagram}`,
      }

      saveNewArtist(data).then((res) => {
        getAllArtist().then((data) => {
          dispath({
            type: actionType.SET_ALL_ARTISTS,
            allArtists: data
          })
        })
      })

      dispath({
        type: actionType.SET_ALERT_TYPE,
        alertType: "success"
      });
      setInterval(() => {
        dispath({
          type: actionType.SET_ALERT_TYPE,
          alertType: null
        });
      }, 4000)

      setIsArtistUpLoading(false);
      setArtistImageCover(null);
      setArtistName(null);
      setTwitter(null);
      setInstagram(null);
    }
  }
  // Save album
  const saveAlbum = () => {
    if (!albumImageCover || !albumName) {
      dispath({
        type: actionType.SET_ALERT_TYPE,
        alertType: "danger"
      });
      setInterval(() => {
        dispath({
          type: actionType.SET_ALERT_TYPE,
          alertType: null
        });
      }, 4000)
    } else {
      setIsAlbumUpLoading(true);
      const data = {
        name: albumName,
        imageURL: albumImageCover
      }

      saveNewAlbum(data).then((res) => {
        getAllAlbum().then((data) => {
          dispath({
            type: actionType.SET_ALL_ALBUMS,
            allAlbums: data
          })
        })
      });

      dispath({
        type: actionType.SET_ALERT_TYPE,
        alertType: "success"
      });
      setInterval(() => {
        dispath({
          type: actionType.SET_ALERT_TYPE,
          alertType: null
        });
      }, 4000)

      setIsAlbumUpLoading(false);
      setAlbumImageCover(null);
      setAlbumName("");
    }
  }
  // Edit Song Button
  const editSongFun = () => {
    setIsAudioLoading(true);
    setisImageLoading(true);
    const data = {
      name: songName === undefined ? editSongs.name : songName,
      imageURL: songImageCover === null ? editSongs.imageURL : songImageCover,
      songURL: audioImageCover === null ? editSongs.songURL : audioImageCover,
      album: albumFilter === null ? editSongs.album : albumFilter,
      artist: artistFilter === null ? editSongs.artist : artistFilter,
      language: languageFilter === null ? editSongs.language : languageFilter,
      category: filterTerm === null || filterTerm === "all" ? editSongs.category : filterTerm,
      role: roleFilter === null ? editSongs.role : roleFilter
    }

    editSong(editSongs._id, data).then(res => {
      if (res.status === 200) {
        getAllSong().then(songs => {
          dispath({
            type: actionType.SET_ALL_SONGS,
            allSongs: songs.data
          })
        });
      }
    })

    dispath({
      type: actionType.SET_ALERT_TYPE,
      alertType: "success"
    });
    setInterval(() => {
      dispath({
        type: actionType.SET_ALERT_TYPE,
        alertType: null
      });
    }, 4000)

    setsongName(null);
    setIsAudioLoading(false);
    setisImageLoading(false);
    setSongImageCover(null);
    setAudioImageCover(null);
    setsongName("");
    dispath({ type: actionType.SET_ARTIST_FILTER, artistFilter: null });
    dispath({ type: actionType.SET_LANGUAGE_FILTER, languageFilter: null });
    dispath({ type: actionType.SET_ALBUM_FILTER, albumFilter: null });
    dispath({ type: actionType.SET_FILTER_TERM, filterTerm: null });
    dispath({ type: actionType.SET_FILTER_ROLE, roleFilter: null });
    dispath({ type: actionType.SET_TYPE, typeForNew: null });
    dispath({ type: actionType.SET_EDIT_SONG, editSongs: null });
    dispath({ type: actionType.SET_TYPE_ALBUM_ARTIST_SONG, typeAlbumArtistSong: "song" });
  }
  // Edit Artist Button
  const editArtistFun = () => {
    setIsArtistUpLoading(true);
    const data = {
      name: artistName === "" ? editArtists.name : artistName,
      imageURL: artistImageCover === null ? editArtists.imageURL : artistImageCover,
      twitter: twitter === "" ? editArtists.twitter : `www.twitter.com/${twitter}`,
      instagram: instagram === "" ? editArtists.instagram : `www.instagram.com/${instagram}`,
    }
    editArtist(editArtists._id, data).then((res) => {
      getAllArtist().then((data) => {
        dispath({
          type: actionType.SET_ALL_ARTISTS,
          allArtists: data
        })
      })
    })

    dispath({
      type: actionType.SET_ALERT_TYPE,
      alertType: "success"
    });
    setInterval(() => {
      dispath({
        type: actionType.SET_ALERT_TYPE,
        alertType: null
      });
    }, 4000)

    setIsArtistUpLoading(false);
    setArtistImageCover(null);
    setArtistName("");
    setTwitter(null);
    setInstagram(null);
    dispath({ type: actionType.SET_TYPE, typeForNew: null });
    dispath({ type: actionType.SET_EDIT_ARTIST, editArtists: null });
    dispath({ type: actionType.SET_TYPE_ALBUM_ARTIST_SONG, typeAlbumArtistSong: "artist" });
  }
  // Edit Album Button
  const editAlbumFun = () => {
    setIsAlbumUpLoading(true);
    const data = {
      name: albumName === "" ? editAlbum.name : albumName,
      imageURL: albumImageCover === null ? editAlbum.imageURL : albumImageCover
    }

    editAlbumApi(editAlbum._id, data).then((res) => {
      getAllAlbum().then((data) => {
        dispath({
          type: actionType.SET_ALL_ALBUMS,
          allAlbums: data
        })
      })
    });

    dispath({
      type: actionType.SET_ALERT_TYPE,
      alertType: "success"
    });
    setInterval(() => {
      dispath({
        type: actionType.SET_ALERT_TYPE,
        alertType: null
      });
    }, 4000)

    setIsAlbumUpLoading(false);
    setAlbumImageCover(null);
    setAlbumName("");
    dispath({ type: actionType.SET_TYPE, typeForNew: null });
    dispath({ type: actionType.SET_EDIT_ALBUM, editAlbum: null });
    dispath({ type: actionType.SET_TYPE_ALBUM_ARTIST_SONG, typeAlbumArtistSong: "album" });
  }
  console.log(typeAlbumArtistSong);
  return (
    <div className='flex flex-col items-center gap-4 justify-center p-4 border border-gray-300 rounded'>
      {/* Edit Song and New Song */}
      {
        typeAlbumArtistSong === "song" ?
          (
            <>
              {
                typeForNew === "Edit" ? (
                  <>
                    <input
                      value={songName}
                      onChange={(e) => setsongName(e.target.value)}
                      type="text" placeholder={editSongs.name} className='w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent' />
                    <div className='flex w-full justify-between flex-wrap items-center gap-4'>
                      <FilterButtons edit={"Edit"} editFilterData={editSongs?.artist} filterData={allArtists?.artist} flag={"Artist"} />
                      <FilterButtons edit={"Edit"} editFilterData={editSongs?.album} filterData={allAlbums?.album} flag={"Album"} />
                      <FilterButtons edit={"Edit"} editFilterData={editSongs?.language} filterData={filterByLanguage} flag={"Language"} />
                      <FilterButtons edit={"Edit"} editFilterData={editSongs?.category} filterData={filters} flag={"Category"} />
                      <FilterButtons edit={"Edit"} editFilterData={editSongs?.role} filterData={role} flag={"Role"} />
                    </div>
                    <div className='bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer'>
                      {
                        isImageLoading && <FileLoader progress={imageUploadProgress} />
                      }
                      {
                        !isImageLoading && (
                          <>
                            {
                              !songImageCover ? (
                                <div style={{ background: `url(${editSongs.imageURL})` }} className='w-full h-full bg-no-repeat'>
                                  <FileUploader updateState={setSongImageCover} setProgress={setImageUploadProgress} isLoading={setisImageLoading} isImage={true} />
                                </div>
                              ) : (<div className='relative w-full h-full overflow-hidden rounded-md'>
                                <img src={songImageCover} className='w-full h-full object-cover' />
                                <button type='button' className='absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none
                    border-none hover:shadow-md duration-200 translation-all ease-in-out' onClick={() => deleteFileObj(songImageCover, true)}>
                                  <MdDelete className='text-white' />
                                </button>
                              </div>)
                            }
                          </>
                        )
                      }
                    </div>
                    <div className='bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer'>
                      {
                        isAudioLoading && <FileLoader progress={audioUploadingProgree} />
                      }
                      {
                        !isAudioLoading && (
                          <>
                            {
                              !audioImageCover ? (
                                <>
                                  <audio className='absolute' src={editSongs.songURL} controls></audio>
                                  <FileUploader updateState={setAudioImageCover} setProgress={setaudioUploadingProgree} isLoading={setIsAudioLoading} isImage={false} />
                                </>
                              ) : (<div className='relative w-full h-full flex items-center justify-center overflow-hidden rounded-md'>
                                <audio src={audioImageCover} controls></audio>
                                <button type='button' className='absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none
                    border-none hover:shadow-md duration-200 translation-all ease-in-out' onClick={() => deleteFileObj(audioImageCover, false)}>
                                  <MdDelete className='text-white' />
                                </button>
                              </div>)
                            }
                          </>
                        )
                      }
                    </div>
                    {/* Save data */}
                    <div className='flex items-center justify-center w-70 p-4'>
                      {isImageLoading || isAudioLoading ? (
                        <LoadingButton
                          loading
                          loadingPosition="start"
                          startIcon={<IoSave />}
                          variant="outlined"
                        >
                          Edit Song
                        </LoadingButton>
                      ) : (
                        <LoadingButton
                          loadingPosition="start"
                          startIcon={<IoSave />}
                          variant="outlined"
                          onClick={editSongFun}
                          className='px-8 py-2 w-full rounded-md text-white bg-red-600 hover:shadow-lg'
                        >
                          Edit Song
                        </LoadingButton>)}
                    </div>
                  </>

                ) : (
                  <>
                    <input
                      value={songName}
                      onChange={(e) => setsongName(e.target.value)} type="text" placeholder='Type your song name...' className='w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent' />

                    <div className='flex w-full justify-between flex-wrap items-center gap-4'>
                      <FilterButtons filterData={allArtists?.artist} flag={"Artist"} />
                      <FilterButtons filterData={allAlbums?.album} flag={"Album"} />
                      <FilterButtons filterData={filterByLanguage} flag={"Language"} />
                      <FilterButtons filterData={filters} flag={"Category"} />
                      <FilterButtons filterData={role} flag={"Role"} />
                    </div>

                    <div className='bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer'>
                      {
                        isImageLoading && <FileLoader progress={imageUploadProgress} />
                      }
                      {
                        !isImageLoading && (
                          <>
                            {
                              !songImageCover ? (
                                <FileUploader updateState={setSongImageCover} setProgress={setImageUploadProgress} isLoading={setisImageLoading} isImage={true} />
                              ) : (<div className='relative w-full h-full overflow-hidden rounded-md'>
                                <img src={songImageCover} className='w-full h-full object-cover' />
                                <button type='button' className='absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none
                    border-none hover:shadow-md duration-200 translation-all ease-in-out' onClick={() => deleteFileObj(songImageCover, true)}>
                                  <MdDelete className='text-white' />
                                </button>
                              </div>)
                            }
                          </>
                        )
                      }
                    </div>

                    {/* Audio loading */}

                    <div className='bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer'>
                      {
                        isAudioLoading && <FileLoader progress={audioUploadingProgree} />
                      }
                      {
                        !isAudioLoading && (
                          <>
                            {
                              !audioImageCover ? (
                                <FileUploader updateState={setAudioImageCover} setProgress={setaudioUploadingProgree} isLoading={setIsAudioLoading} isImage={false} />
                              ) : (<div className='relative w-full h-full flex items-center justify-center overflow-hidden rounded-md'>
                                <audio src={audioImageCover} controls></audio>
                                <button type='button' className='absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none
                    border-none hover:shadow-md duration-200 translation-all ease-in-out' onClick={() => deleteFileObj(audioImageCover, false)}>
                                  <MdDelete className='text-white' />
                                </button>
                              </div>)
                            }
                          </>
                        )
                      }
                    </div>

                    {/* Save data */}

                    <div className='flex items-center justify-center w-70 p-4'>
                      {isImageLoading || isAudioLoading ? (
                        <LoadingButton
                          loading
                          loadingPosition="start"
                          startIcon={<IoSave />}
                          variant="outlined"
                        >
                          Save Song
                        </LoadingButton>
                      ) : (
                        <LoadingButton
                          loadingPosition="start"
                          startIcon={<IoSave />}
                          variant="outlined"
                          onClick={saveSong}
                          className='px-8 py-2 w-full rounded-md text-white bg-red-600 hover:shadow-lg'
                        >
                          Save Song
                        </LoadingButton>)}
                    </div>
                  </>
                )
              }
            </>
          ) : (<></>)
      }

      {/* Edit Artist and New Artist */}
      {
        typeAlbumArtistSong === "artist" ? (<>
          {
            typeForNew === "Edit" ? (<>
              <p className='text-xl font-semibold text-headingColor'>Edit Artist Details</p>
              <div className='bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer'>
                {
                  isArtistUpLoading && <FileLoader progress={artistUploadingProgress} />
                }
                {
                  !isArtistUpLoading && (
                    <>
                      {
                        !artistImageCover ? (
                          <div style={{ background: `url(${editArtists.imageURL})` }} className='w-full h-full bg-no-repeat'>
                            <FileUploader updateState={setArtistImageCover} setProgress={setArtistUploadingProgress} isLoading={setIsArtistUpLoading} isImage={true} />
                          </div>
                        ) : (<div className='relative w-full h-full overflow-hidden rounded-md'>
                          <img src={artistImageCover} className='w-full h-full object-cover' />
                          <button type='button' className='absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none
                    border-none hover:shadow-md duration-200 translation-all ease-in-out' onClick={() => deleteFileArtistandAlbum(artistImageCover, "artist")}>
                            <MdDelete className='text-white' />
                          </button>
                        </div>
                        )
                      }
                    </>
                  )
                }
              </div>
              {/* Artist Name */}
              <input
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                type="text" placeholder={editArtists.name} className='w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent' />
              {/* Twiter Name */}
              <div className='flex items-center p-3 border border-gray-300 w-full'>
                <p className='text-base font-semibold text-gray-400'>www.twitter.com/</p>
                <input value={twitter} onChange={(e) => setTwitter(e.target.value)} type='text' placeholder={editArtists.twitter} className='w-full text-base font-semibold text-textColor outline-none bg-transparent' />
              </div>
              {/* Instagram Name */}
              <div className='flex items-center p-3 border border-gray-300 w-full'>
                <p className='text-base font-semibold text-gray-400'>www.instagram.com/</p>
                <input value={instagram} onChange={(e) => setInstagram(e.target.value)} type='text' placeholder={editArtists.instagram} className='w-full text-base font-semibold text-textColor outline-none bg-transparent' />
              </div>
              {/* Edit Artist */}
              <div className='flex items-center justify-center w-70 p-4'>
                {isArtistUpLoading ? (
                  <LoadingButton
                    loading
                    loadingPosition="start"
                    startIcon={<IoSave />}
                    variant="outlined"
                  >
                    Edit Artist
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    loadingPosition="start"
                    startIcon={<IoSave />}
                    variant="outlined"
                    onClick={editArtistFun}
                    className='px-8 py-2 w-full rounded-md text-white bg-red-600 hover:shadow-lg'
                  >
                    Edit Artist
                  </LoadingButton>)}
              </div>
            </>) :
              (<>
                {/* Image update for Artist */}
                <p className='text-xl font-semibold text-headingColor'>Artist Details</p>
                <div className='bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer'>
                  {
                    isArtistUpLoading && <FileLoader progress={artistUploadingProgress} />
                  }
                  {
                    !isArtistUpLoading && (
                      <>
                        {
                          !artistImageCover ? (
                            <FileUploader updateState={setArtistImageCover} setProgress={setArtistUploadingProgress} isLoading={setIsArtistUpLoading} isImage={true} />
                          ) : (<div className='relative w-full h-full overflow-hidden rounded-md'>
                            <img src={artistImageCover} className='w-full h-full object-cover' />
                            <button type='button' className='absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none
                    border-none hover:shadow-md duration-200 translation-all ease-in-out' onClick={() => deleteFileArtistandAlbum(artistImageCover, "artist")}>
                              <MdDelete className='text-white' />
                            </button>
                          </div>)
                        }
                      </>
                    )
                  }
                </div>

                {/* Artist Name */}
                <input
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)} id='song'
                  type="text" placeholder='Artist name...' className='w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent' />
                {/* Twiter Name */}
                <div className='flex items-center p-3 border border-gray-300 w-full'>
                  <p className='text-base font-semibold text-gray-400'>www.twitter.com/</p>
                  <input value={twitter} onChange={(e) => setTwitter(e.target.value)} type='text' placeholder='your twitter id' className='w-full text-base font-semibold text-textColor outline-none bg-transparent' />
                </div>
                {/* Instagram Name */}
                <div className='flex items-center p-3 border border-gray-300 w-full'>
                  <p className='text-base font-semibold text-gray-400'>www.instagram.com/</p>
                  <input value={instagram} onChange={(e) => setInstagram(e.target.value)} type='text' placeholder='your instagram id' className='w-full text-base font-semibold text-textColor outline-none bg-transparent' />
                </div>
                {/* Save Artist */}
                <div className='flex items-center justify-center w-70 p-4'>
                  {isArtistUpLoading ? (
                    <LoadingButton
                      loading
                      loadingPosition="start"
                      startIcon={<IoSave />}
                      variant="outlined"
                    >
                      Save Artist
                    </LoadingButton>
                  ) : (
                    <LoadingButton
                      loadingPosition="start"
                      startIcon={<IoSave />}
                      variant="outlined"
                      onClick={saveArtist}
                      className='px-8 py-2 w-full rounded-md text-white bg-red-600 hover:shadow-lg'
                    >
                      Save Artist
                    </LoadingButton>)}
                </div>
              </>)
          }
        </>) : (<></>)
      }

      {
        typeAlbumArtistSong === "album" ?
          typeForNew === "Edit" ? (<>
            <p className='text-xl font-semibold text-headingColor'>Edit Album Details</p>
            <div className='bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer'>
              {
                isAlbumUpLoading && <FileLoader progress={albumUploadingProgress} />
              }
              {
                !isAlbumUpLoading && (
                  <>
                    {
                      !albumImageCover ? (
                        <div style={{ background: `url(${editAlbum.imageURL})` }} className='w-full h-full bg-no-repeat'>
                          <FileUploader updateState={setAlbumImageCover} setProgress={setAlbumUploadingProgress} isLoading={setIsAlbumUpLoading} isImage={true} />
                        </div>
                      ) : (<div className='relative w-full h-full overflow-hidden rounded-md'>
                        <img src={albumImageCover} className='w-full h-full object-cover' />
                        <button type='button' className='absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none
                    border-none hover:shadow-md duration-200 translation-all ease-in-out' onClick={() => deleteFileArtistandAlbum(albumImageCover, "album")}>
                          <MdDelete className='text-white' />
                        </button>
                      </div>)
                    }
                  </>
                )
              }
            </div>
            {/* Album Name */}
            <input
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              type="text" placeholder={editAlbum.name} className='w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent' />

            {/* Edit Album */}
            <div className='flex items-center justify-center w-70 p-4'>
              {isAlbumUpLoading ? (
                <LoadingButton
                  loading
                  loadingPosition="start"
                  startIcon={<IoSave />}
                  variant="outlined"
                >
                  Edit Album
                </LoadingButton>
              ) : (
                <LoadingButton
                  loadingPosition="start"
                  startIcon={<IoSave />}
                  variant="outlined"
                  onClick={editAlbumFun}
                  className='px-8 py-2 w-full rounded-md text-white bg-red-600 hover:shadow-lg'
                >
                  Edit Album
                </LoadingButton>)}
            </div>

          </>) : (
            <>
              {/* Album Information */}
              <p className='text-xl font-semibold text-headingColor'>Album Details</p>
              <div className='bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer'>
                {
                  isAlbumUpLoading && <FileLoader progress={albumUploadingProgress} />
                }
                {
                  !isAlbumUpLoading && (
                    <>
                      {
                        !albumImageCover ? (
                          <FileUploader updateState={setAlbumImageCover} setProgress={setAlbumUploadingProgress} isLoading={setIsAlbumUpLoading} isImage={true} />
                        ) : (<div className='relative w-full h-full overflow-hidden rounded-md'>
                          <img src={albumImageCover} className='w-full h-full object-cover' />
                          <button type='button' className='absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none
                    border-none hover:shadow-md duration-200 translation-all ease-in-out' onClick={() => deleteFileArtistandAlbum(albumImageCover, "album")}>
                            <MdDelete className='text-white' />
                          </button>
                        </div>)
                      }
                    </>
                  )
                }
              </div>

              {/* Album Name */}
              <input
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)} id='song'
                type="text" placeholder='Album name...' className='w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent' />

              {/* Save Album */}
              <div className='flex items-center justify-center w-70 p-4'>
                {isAlbumUpLoading ? (
                  <LoadingButton
                    loading
                    loadingPosition="start"
                    startIcon={<IoSave />}
                    variant="outlined"
                  >
                    Save Album
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    loadingPosition="start"
                    startIcon={<IoSave />}
                    variant="outlined"
                    onClick={saveAlbum}
                    className='px-8 py-2 w-full rounded-md text-white bg-red-600 hover:shadow-lg'
                  >
                    Save Album
                  </LoadingButton>)}
              </div>
            </>
          )
          : (<></>)
      }
    </div>
  )
}

export const FileUploader = ({ updateState, setProgress, isLoading, isImage }) => {
  const [{ editSongs, editArtists, typeForNew, typeAlbumArtistSong, editAlbum }, dispath] = useStateValue();
  const uploadFile = (e) => {
    if (typeForNew === "Edit" && isImage === true && typeAlbumArtistSong === "song") {
      const deleteRef = ref(storage, editSongs?.imageURL);
      deleteObject(deleteRef).then(() => { });
    }

    if (typeForNew === "Edit" && isImage === false && typeAlbumArtistSong === "song") {
      const deleteRef = ref(storage, editSongs?.songURL);
      deleteObject(deleteRef).then(() => { });
    }

    if (typeForNew === "Edit" && isImage === true && typeAlbumArtistSong === "artist") {
      const deleteRef = ref(storage, editArtists?.imageURL);
      deleteObject(deleteRef).then(() => { });
    }

    if (typeForNew === "Edit" && isImage === true && typeAlbumArtistSong === "album") {
      const deleteRef = ref(storage, editAlbum?.imageURL);
      deleteObject(deleteRef).then(() => { });
    }

    isLoading(true);
    const uploadedFile = e.target.files[0];
    const storageRef = ref(storage, `${isImage ? "Images" : "Audio"}/${Date.now()}-${uploadedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, uploadedFile);
    uploadTask.on("state_changed", (snapshot) => {
      setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
    }, (er) => {
      console.log(er);

      dispath({
        type: actionType.SET_ALERT_TYPE,
        alertType: "danger"
      });
      setInterval(() => {
        dispath({
          type: actionType.SET_ALERT_TYPE,
          alertType: null
        });
      }, 4000)

    }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        updateState(downloadURL);
        isLoading(false);
      });
      dispath({
        type: actionType.SET_ALERT_TYPE,
        alertType: "success"
      });
      setInterval(() => {
        dispath({
          type: actionType.SET_ALERT_TYPE,
          alertType: null
        });
      }, 5000)
    })
  }
  return (
    <label>
      <div className='flex flex-col items-center justify-center h-full'>
        <div className='flex flex-col justify-center items-center cursor-pointer'>
          <p className='font-bold text-2xl'>
            <BiCloudUpload />
          </p>
          <p className='text-lg'>Click to upload {isImage ? "an image" : "an audio"}</p>
        </div>
      </div>
      <input type='file' name='upload-file' accept={`${isImage ? "image/*" : "audio/*"}`} className='w-0 h-0' onChange={uploadFile} />
    </label>
  )
}

export const FileLoader = ({ progress }) => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <p className='text-xl font-semibold text-textColor'>
        {Math.round(progress) > 0 && (<>{`${Math.round(progress)}%`}</>)}
      </p>
      <CircularProgress sx={{ display: "flex" }} />
    </div>
  )
}

export default DashboardNewSong
