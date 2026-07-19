import { useState, useRef, useEffect } from 'react';
import { Pause, Play } from 'lucide-react';



const Editorial = ({ secureUrl, thumbnailUrl, duration,textEditorial }) => {
 console.log("secureUrl:", secureUrl);
  console.log("thumbnailUrl:", thumbnailUrl);
  console.log("duration:", duration);
  console.log("textEditorial:", textEditorial);

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update current time during playback
  useEffect(() => {
    const video = videoRef.current;
    
    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };
    
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, []);

  return (
    <div 
      className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video Element */}
      {/* <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        className="w-full aspect-video bg-black cursor-pointer"
      /> */}
      {secureUrl ? (
  <>
    <div className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        className="w-full aspect-video bg-black cursor-pointer"
      />

      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity ${
          isHovering || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={togglePlayPause}
          className="btn btn-circle btn-primary mr-3"
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>

        <div className="flex items-center w-full mt-2">
          <span className="text-white text-sm mr-2">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => {
              if (videoRef.current) {
                videoRef.current.currentTime = Number(e.target.value);
              }
            }}
            className="range range-primary range-xs flex-1"
          />

          <span className="text-white text-sm ml-2">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  </>
) : (
  <div className="bg-base-800 rounded-xl p-8 text-center">
    <p className="text-gray-400">
      No video editorial available.
    </p>
  </div>
)}
      {/* <div className="mt-8 bg-base-800 rounded-xl p-6">
    <h2 className="text-2xl font-bold mb-4">
        Written Editorial
    </h2> */}
    <div className="mt-8 bg-base-800 rounded-xl p-6">

    {textEditorial ? (
        <p className="whitespace-pre-wrap">
            {textEditorial}
        </p>
    ) : (
      <div className="mt-8 bg-base-800 rounded-xl p-6 text-center">
        <p className="text-gray-400">
            No written editorial available.
        </p>
        </div>
    )}
</div>

    </div>
  );
};


export default Editorial;