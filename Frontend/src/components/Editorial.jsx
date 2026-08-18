import { useState, useRef, useEffect } from 'react';
import { Pause, Play } from 'lucide-react';



const Editorial = ({ secureUrl, thumbnailUrl, duration,textEditorial }) => {
  console.log("secureUrl:", secureUrl);
  console.log("thumbnailUrl:", thumbnailUrl);
  console.log("duration:", duration);
  console.log("textEditorial:", textEditorial);

  // Custom parser to translate markdown content into styled HTML safely
  const renderMarkdown = (text) => {
    if (!text) return '';
    
    // Basic HTML escaping
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Headers
    html = html.replace(/^### (.*?)$/gm, '<h3 class="text-base font-bold text-white mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="text-lg font-bold text-white mt-5 mb-2">$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1 class="text-xl font-extrabold text-white mt-6 mb-3 border-b border-zinc-800 pb-1">$1</h1>');

    // Fenced Code block
    html = html.replace(/```(?:[a-zA-Z0-9]+)?\n([\s\S]*?)\n```/g, '<pre class="bg-black/50 border border-zinc-800 p-4 rounded-xl font-mono text-xs text-zinc-300 overflow-x-auto my-4">$1</pre>');

    // Inline Code
    html = html.replace(/`([^`\n]+)`/g, '<code class="bg-zinc-850 text-zinc-250 px-1.5 py-0.5 rounded font-mono text-[11px] border border-zinc-800">$1</code>');

    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');

    // Italics
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-zinc-300">$1</em>');

    // Lists
    html = html.replace(/^[*-] (.*?)$/gm, '<li class="ml-4 list-disc text-zinc-300 my-1">$1</li>');

    // Blockquotes
    html = html.replace(/^> (.*?)$/gm, '<blockquote class="border-l-4 border-zinc-700 pl-4 py-1 italic text-zinc-400 my-3">$1</blockquote>');

    // Paragraph split
    const blocks = html.split(/(\n\n|<h[1-3]>|<pre>|<\/pre>|<li>|<blockquote>|<\/blockquote>)/);
    html = blocks.map(block => {
      if (!block.trim()) return '';
      if (
        block.startsWith('<h') || 
        block.startsWith('<pre') || 
        block.startsWith('</pre') || 
        block.startsWith('<li') || 
        block.startsWith('<block') || 
        block.startsWith('</block') || 
        block === '\n\n'
      ) {
        return block;
      }
      return `<p class="text-zinc-300 leading-relaxed my-2 text-sm">${block}</p>`;
    }).join('');

    return html;
  };

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
        <div 
            className="prose prose-invert max-w-none text-zinc-350 leading-relaxed text-sm"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(textEditorial) }}
        />
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