import React,{useEffect, useState} from 'react'
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import {Header} from "./index";
import { getAllSong } from '../api';

const PageHome = () => {
  const [allSongs,setallSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useState(null);
  const delay = 2500;

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    getAllSong().then(res => {
      setallSongs(res?.song);
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
      setCurrentIndex((prevIndex) =>
          prevIndex === res.song?.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );
    })

    return () => {
      resetTimeout();
    };
  }, [currentIndex]);


  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? allSongs.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === allSongs.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className='w-full h-auto flex flex-col items-center justify-center bg-primary'>
      <Header />
      <h1 class="mb-4 text-3xl font-extrabold text-gray-900 dark:text-gray-900 md:text-5xl lg:text-6xl"><span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Music</span> Web.</h1>
      <p class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">This is a place for you to enjoy peaceful and vibrant moments.</p>
      <div className="grid gap-4">
      <div className='max-w-[1500px] h-[350px] w-full m-auto py-5 relative group'>
      <div
        style={{ backgroundImage: `url(${allSongs[currentIndex]?.imageURL})`,objectFit: "contain"}}
        className='w-full h-full rounded-2xl bg-center bg-cover duration-500'
      ></div>
      {/* Left Arrow */}
      <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactLeft onClick={prevSlide} size={30} />
      </div>
      {/* Right Arrow */}
      <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactRight onClick={nextSlide} size={30} />
      </div>
      <div className='flex top-4 justify-center py-2'>
        {allSongs.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className='text-2xl cursor-pointer'
          >
            <RxDotFilled />
          </div>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-5 gap-4">
        <div>
            <img style={{height: 200}} className="w-275 rounded-lg" src={allSongs[0]?.imageURL} alt="" />
        </div>
        <div>
            <img style={{height: 200}} className="w-275 rounded-lg" src={allSongs[1]?.imageURL} alt="" />
        </div>
        <div>
            <img style={{height: 200}} className="w-275 rounded-lg" src={allSongs[2]?.imageURL} alt="" />
        </div>
        <div>
            <img style={{height: 200}} className="w-275 rounded-lg" src={allSongs[3]?.imageURL} alt="" />
        </div>
        <div>
            <img style={{height: 200}} className="w-275 rounded-lg" src={allSongs[4]?.imageURL} alt="" />
        </div>
    </div>
</div>
    </div>
  )
}

export default PageHome