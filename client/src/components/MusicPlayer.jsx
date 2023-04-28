import React, { useEffect, useState, Fragment } from 'react';
import { useStateValue } from '../context/StateProvider';
import { motion } from 'framer-motion';
import { RiPlayListFill } from "react-icons/ri";
import { IoArrowRedo } from "react-icons/io5";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { getAllSong } from '../api/index';
import { actionType } from '../context/reducer';
import { IoClose, IoMusicalNote, IoShuffle, IoRepeat, IoCloudDownloadOutline } from "react-icons/io5";
import Button from '@mui/material/Button';import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';

const MusicPlayer = () => {
    const [{ allSongs, isSongPlaying, songIndex, user, miniPlayer, page, rowsPerPage, filterTerm, searchSong }, dispatch] = useStateValue();
    const [checkRandom, setCheckRandom] = useState(false);
    const [checkPlayAll, setcheckPlayAll] = useState(false);
    const [isPlayList, setIsPlayList] = useState(false);
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleNavigate = () => {
        navigate("/premium");
        dispatch({
            type: actionType.SET_ISSONG_PLAYING,
            isSongPlaying: false
        })
        setOpen(false);
    }

    useEffect(() => {
        if (!allSongs) {
            getAllSong().then(data => {
                dispatch({
                    type: actionType.SET_ALL_SONGS,
                    allSongs: data?.song
                })
            })
        }
    }, [page, rowsPerPage, filterTerm, searchSong, isPlayList])

    const downloadAudioFile = async (downloadURL, name) => {
        try {
            const response = await fetch(downloadURL);
            const data = await response.blob();
            console.log(data);
            const url = window.URL.createObjectURL(data);
            console.log(url);
            const link = document.createElement('a');
            link.href = url;
            link.download = name + ".mp3";
            document.body.appendChild(link);
            link.click();
            link.remove();
            return true;
        } catch (error) {
            return false;
        }
    };

    const togglePlayer = () => {
        if (miniPlayer) {
            dispatch({
                type: actionType.SET_MINI_PLAYER,
                miniPlayer: false,
            });
        } else {
            dispatch({
                type: actionType.SET_MINI_PLAYER,
                miniPlayer: true,
            });
        }
    };

    const nextTrack = () => {
        const data = (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)).length === 0 ?
            (filterTerm?.toLowerCase() === "all" && searchSong !== "" ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)) : (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
        if (songIndex > data.length - 1) {
            dispatch({
                type: actionType.SET_SONG_INDEX,
                songIndex: 0
            })
        } else {
            if (songIndex === data.length - 1) {
                dispatch({
                    type: actionType.SET_SONG_INDEX,
                    songIndex: 0
                })
            } else {
                dispatch({
                    type: actionType.SET_SONG_INDEX,
                    songIndex: songIndex + 1
                })
            }
        }
    }

    const previousTrack = () => {
        const data = (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)).length === 0 ?
            (filterTerm?.toLowerCase() === "all" && searchSong !== "" ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)) : (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
        if (songIndex === 0) {
            dispatch({
                type: actionType.SET_SONG_INDEX,
                songIndex: data.length - 1
            })
        } else {
            dispatch({
                type: actionType.SET_SONG_INDEX,
                songIndex: songIndex - 1
            })
        }
    }

    const closePlayer = () => {
        dispatch({
            type: actionType.SET_ISSONG_PLAYING,
            isSongPlaying: false
        })
    }

    const randomSong = () => {
        let newIndex;
        const data = (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)).length === 0 ?
            (filterTerm?.toLowerCase() === "all" && searchSong !== "" ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)) : (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
        do {
            newIndex = Math.floor(Math.random() * data.length)
            dispatch({
                type: actionType.SET_SONG_INDEX,
                songIndex: newIndex
            })
        } while (newIndex === songIndex);
    }

    const playAllSong = () => {
        const data = (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)).length === 0 ?
            (filterTerm?.toLowerCase() === "all" && searchSong !== "" ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)) : (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
        if (songIndex === data.length - 1) {
            dispatch({
                type: actionType.SET_SONG_INDEX,
                songIndex: 0
            })
        } else {
            dispatch({
                type: actionType.SET_SONG_INDEX,
                songIndex: songIndex + 1
            })
        }
    }

    const checkIsRandom = () => {
        setcheckPlayAll(false);
        setCheckRandom(!checkRandom);
    }

    const playAllMusic = () => {
        setCheckRandom(false)
        setcheckPlayAll(!checkPlayAll);
    }

    // const data = (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "")  ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.imageURL : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.imageURL).length === 0 ? 
    // (filterTerm?.toLowerCase() === "all" && searchSong !== "" ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.imageURL : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.imageURL) : (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "")  ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.imageURL : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.imageURL);

    // console.log((filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.songURL : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.songURL) !== "" ?
    //     (filterTerm?.toLowerCase() === "all" && searchSong !== "" ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.songURL : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.songURL) :
    //     (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.songURL : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.songURL))

    return (
        <div className='w-full full flex items-center gap-3 overflow-hidden'>
            <div className={`w-full full items-center gap-3 p-4 ${miniPlayer ? "absolute top-40" : "flex relative"
                }`}>
                <img src={
                    ((filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.imageURL : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.imageURL) === undefined ?
                        (filterTerm?.toLowerCase() === "all" && searchSong !== "" ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.imageURL : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.imageURL) : (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.imageURL : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.imageURL))
                } alt='' className='w-40 h-20 object-cover rounded-md' />
                <div className='flex items-start flex-col'>
                    <p className='text-'>
                        {
                            (filterTerm?.toLowerCase() === "all" && searchSong === null ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.name.length > 12 ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.name.slice(0, 12) + "..." : allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.name : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.name.length > 12 ? allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.name.slice(0, 12) + "..." : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.name) ||
                            (filterTerm?.toLowerCase() === "all" && searchSong !== null ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.name.length > 12 ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.name.slice(0, 12) + "..." : allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.name : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.name.length > 12 ? allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.name.slice(0, 12) + "..." : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.name)
                        }{" "}
                        <span className='text-base'>({
                            (filterTerm?.toLowerCase() === "all" && searchSong === null ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.album.length > 12 ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.album.slice(0, 12) + "..." : allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.album : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.album.length > 12 ? allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.album.slice(0, 12) + "..." : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.album) ||
                            (filterTerm?.toLowerCase() === "all" && searchSong !== null ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.album.length > 12 ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.album.slice(0, 12) + "..." : allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.album : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.album.length > 12 ? allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.album.slice(0, 12) + "..." : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.album)
                        })</span>
                    </p>
                    <p className='text-textColor'>
                        {
                            (filterTerm?.toLowerCase() === "all" && searchSong === null ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.artist.length > 12 ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.artist.slice(0, 12) + "..." : allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.artist : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.artist.length > 12 ? allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.artist.slice(0, 12) + "..." : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.artist) ||
                            (filterTerm?.toLowerCase() === "all" && searchSong !== null ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.artist.length > 12 ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.artist.slice(0, 12) + "..." : allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.artist : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.artist.length > 12 ? allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.artist.slice(0, 12) + "..." : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.artist)
                        }
                        <span className='text-sm text-textColor font-semibold'>
                            (
                            {
                                (filterTerm?.toLowerCase() === "all" && searchSong === null ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.category.length > 12 ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.category.slice(0, 12) + "..." : allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.category : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.category.length > 12 ? allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.category.slice(0, 12) + "..." : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.category) ||
                                (filterTerm?.toLowerCase() === "all" && searchSong !== null ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.category.length > 12 ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.category.slice(0, 12) + "..." : allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.category : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.category.length > 12 ? allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.category.slice(0, 12) + "..." : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.category)
                            }
                            )
                        </span>
                    </p>
                    <motion.i whiletap={{ scale: 0.8 }} >
                        <RiPlayListFill onClick={() => setIsPlayList(!isPlayList)} className='text-textColor hover:text-headingColor text-lg' />
                    </motion.i>
                </div>
                <div className='flex-1'>
                    <AudioPlayer
                        src={
                            (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.songURL : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.songURL) === undefined ?
                                (filterTerm?.toLowerCase() === "all" && searchSong !== "" ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.songURL : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.songURL) :
                                (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.songURL : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.songURL)
                        }
                        onPlay={() => console.log("is playing")}
                        autoPlay={true}
                        showSkipControls={true}
                        onClickNext={nextTrack}
                        onClickPrevious={previousTrack}
                        onEnded={checkRandom === true ? randomSong : checkPlayAll === true ? playAllSong : false}
                    />
                </div>
                {user?.user?.role === "admin" || user?.user?.role === "premium" ? (
                    <div className='h-full flex items-center justify-center flex-row'>
                        <IoShuffle style={{ fontSize: 27, marginLeft: -1150, marginTop: 26 }} className={`${checkRandom === true ? "text-red-600" : "text-textColor"} mt-4 hover:scale-150 text-lg`} onClick={checkIsRandom} />
                        <IoRepeat style={{ fontSize: 27, marginTop: 26, marginLeft: 7 }} className={`${checkPlayAll === true ? "text-red-600" : "text-textColor"} mt-4 hover:scale-150 text-lg`} onClick={playAllMusic} />
                        <a className={`hover:scale-150 text-lg mt-4`} style={{ fontSize: 27, marginLeft: 750, marginTop: 26 }} onClick={() => downloadAudioFile(
                            (
                                (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.songURL : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.songURL) === undefined ?
                                    (filterTerm?.toLowerCase() === "all" && searchSong !== "" ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.songURL : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.songURL) :
                                    (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.songURL : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.songURL)
                            ),
                            (
                                (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.name : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.name) === undefined ?
                                    (filterTerm?.toLowerCase() === "all" && searchSong !== "" ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.name : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.name) :
                                    (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.name : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.name)
                            )
                        )}><IoCloudDownloadOutline /></a>
                    </div>
                ) : (<></>)}
                {user?.user?.role === "member" && (
                    <div className='h-full flex items-center justify-center flex-row'>
                        <IoShuffle style={{ fontSize: 27, marginLeft: -1150, marginTop: 26 }} className={`${checkRandom === true ? "text-red-600" : "text-textColor"} mt-4 hover:scale-150 text-lg`} onClick={handleClickOpen} />
                        <IoRepeat style={{ fontSize: 27, marginTop: 26, marginLeft: 7 }} className={`${checkPlayAll === true ? "text-red-600" : "text-textColor"} mt-4 hover:scale-150 text-lg`} onClick={handleClickOpen} />
                        <a className={`hover:scale-150 text-lg mt-4`} style={{ fontSize: 27, marginLeft: 750, marginTop: 26 }} onClick={handleClickOpen}><IoCloudDownloadOutline /></a>
                    </div>
                )}

                {/* Dialog Box */}
                <div>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"What's happening?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                You need to be a Premium Member in order to use feature.
                                Please click Premium to process
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}
                                variant="outlined" color="error"
                                className="mr-1"
                            >Disagree</Button>
                            <Button variant="contained" color="success" onClick={handleNavigate}>
                                Premium
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <div className="h-full flex items-center justify-center flex-col gap-3">
                    <motion.i whiletap={{ scale: 0.8 }} onClick={closePlayer}>
                        <IoClose className="text-textColor hover:text-headingColor text-2xl cursor-pointer" />
                    </motion.i>
                    <motion.i whiletap={{ scale: 0.8 }} onClick={togglePlayer}>
                        <IoArrowRedo className="text-textColor hover:text-headingColor text-2xl cursor-pointer" />
                    </motion.i>
                </div>
                
            </div>

            {isPlayList && (
                <>
                    <PlayListCard />
                </>
            )}

            {miniPlayer && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed right-5 bottom-5"
                >
                    <div className="w-20 h-20 rounded-full flex items-center justify-center relative ">
                        <div className="w-20 h-20 absolute inset-0 rounded-full bg-red-500 blur-xl animate-pulse"></div>
                        <img
                            onClick={togglePlayer}
                            src={
                                (filterTerm?.toLowerCase() === "all" && searchSong === null ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.imageURL : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.imageURL) ||
                                (filterTerm?.toLowerCase() === "all" && searchSong !== null ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.imageURL : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[songIndex]?.imageURL)
                            }
                            className="z-50 w-20 h-20 rounded-full object-cover cursor-pointer"
                            alt=""
                        />
                    </div>
                </motion.div>
            )}
        </div>
    )
}

export const PlayListCard = () => {
    const [{ allSongs, isSongPlaying, songIndex, page, rowsPerPage, filterTerm, searchSong }, dispatch] = useStateValue();
    useEffect(() => {
        if (!allSongs) {
            getAllSong().then(data => {
                dispatch({
                    type: actionType.SET_ALL_SONGS,
                    allSongs: data?.song
                })
            })
        }
    }, [page, rowsPerPage, filterTerm, searchSong])

    const setCurrentPlaySong = (index) => {
        if (!isSongPlaying) {
            dispatch({
                type: actionType.SET_ISSONG_PLAYING,
                isSongPlaying: true
            })
        }

        if (songIndex !== index) {
            dispatch({
                type: actionType.SET_SONG_INDEX,
                songIndex: index
            })
        }
    }

    const data = (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)).length === 0 ?
        (filterTerm?.toLowerCase() === "all" && searchSong !== "" ? allSongs?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : allSongs?.filter(p => String(p.category).includes(filterTerm))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)) : (filterTerm?.toLowerCase() === "all" && (searchSong === null || searchSong === "") ? allSongs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : allSongs?.filter(p => String(p.category).includes(filterTerm))?.filter(p => String(p.name).startsWith(searchSong))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
    return (
        <div className='absolute left-4 bottom-24 gap-2 py-2 w-350 max-w-[350px] h-510 max-h-[510px] flex flex-col overflow-y-scroll rounded-md shadow-md bg-primary z-50'>
            {
                data.map((music, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, translateX: -50 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className='group w-full p-4 hover:bg-card flex gap-3 items-center cursor-pointer bg-transparent'
                        onClick={() => setCurrentPlaySong(index)}
                    >
                        <IoMusicalNote className="text-textColor group-hover:text-headingColor text-2xl cursor-pointer" />
                        <div className='flex items-start flex-col'>
                            <p className='text-lg text-headingColor font-semibold'>
                                {
                                    `${music?.name?.length > 20 ? music?.name.slice(0, 20) : music?.name
                                    }`
                                }{" "}
                                <span className='text-base'>({music?.album})</span>
                            </p>
                            <p className='text-textColor'>
                                {music?.artist}{" "}
                                <span className='text-sm text-textColor font-semibold'>
                                    ({music?.category})
                                </span>
                            </p>
                        </div>
                    </motion.div>
                ))
            }
        </div>
    )
}

export default MusicPlayer
