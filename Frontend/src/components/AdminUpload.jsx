import { useParams, NavLink } from 'react-router-dom';
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient'
import { UploadCloud, Video, FileVideo, Trash2, ArrowLeft, CheckCircle2, Play, Info, Sparkles, Clock, Calendar, Loader2} from "lucide-react";

function AdminUpload() {
  const { problemId } = useParams();
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm();

  const selectedFile = watch('videoFile')?.[0];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        // Validate file size (100MB limit)
        if (file.size > 100 * 1024 * 1024) {
          setError('videoFile', { type: 'manual', message: 'File size must be less than 100MB' });
          return;
        }
        
        // Put files directly into native input element
        if (fileInputRef.current) {
          fileInputRef.current.files = e.dataTransfer.files;
          // Dispatch change event to notify react-hook-form
          const event = new Event('change', { bubbles: true });
          fileInputRef.current.dispatchEvent(event);
        }
        clearErrors('videoFile');
      } else {
        setError('videoFile', { type: 'manual', message: 'Please select a valid video file' });
      }
    }
  };

  // Upload video to Cloudinary
  const onSubmit = async (data) => {
    const file = data.videoFile[0];
    
    setUploading(true);
    setUploadProgress(0);
    clearErrors();
    setUploadedVideo(null);

    try {
      // Step 1: Get upload signature from backend
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;

      // Step 2: Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);

      // Step 3: Upload directly to Cloudinary
      const uploadResponse = await axios.post(upload_url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      // Step 4: Save video metadata to backend
      const metadataResponse = await axiosClient.post('/video/save', {
        problemId: problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      reset(); // Reset form after successful upload
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('root', {
        type: 'manual',
        message: err.response?.data?.message || 'Upload failed. Please check backend connections and try again.'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#09090b] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.05),rgba(255,255,255,0))] text-white py-10 px-4">
      <div className="max-w-xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex items-center gap-4 mb-8">
          <NavLink
            to="/admin/video"
            className="p-2.5 bg-[#18181b]/60 border border-[#27272a] hover:border-zinc-400 hover:text-white rounded-xl text-zinc-400 transition-all duration-200"
          >
            <ArrowLeft size={18} />
          </NavLink>
          <div>
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <Video size={12} />
              Problem Media Upload
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Upload Video Solution
            </h1>
          </div>
        </div>

        {/* Info card */}
        <div className="mb-6 p-4 bg-[#18181b]/40 border border-[#27272a] rounded-2xl flex gap-3 text-sm text-zinc-400">
          <Info size={20} className="text-zinc-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Uploading a video solution automatically registers it on the problem page. 
            Supported formats: <strong className="text-zinc-200">MP4, WebM, QuickTime</strong>. Maximum file size: <strong className="text-zinc-200">100MB</strong>.
          </p>
        </div>

        {/* Main Upload Card */}
        <div className="bg-[#09090b]/80 backdrop-blur-xl border border-[#27272a] rounded-2xl shadow-2xl p-6 md:p-8">
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Interactive Drag & Drop Area */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                isDragActive 
                  ? 'border-zinc-300 bg-zinc-800/10' 
                  : selectedFile 
                    ? 'border-zinc-500 bg-[#18181b]/20' 
                    : 'border-[#27272a] hover:border-zinc-500 bg-[#18181b]/40'
              }`}
            >
              <input
                type="file"
                accept="video/*"
                className="hidden"
                {...register('videoFile', {
                  required: 'Please select a video file',
                  validate: {
                    isVideo: (files) => {
                      if (!files || !files[0]) return 'Please select a video file';
                      const file = files[0];
                      return file.type.startsWith('video/') || 'Please select a valid video file';
                    },
                    fileSize: (files) => {
                      if (!files || !files[0]) return true;
                      const file = files[0];
                      const maxSize = 100 * 1024 * 1024; // 100MB
                      return file.size <= maxSize || 'File size must be less than 100MB';
                    }
                  }
                })}
                ref={(e) => {
                  register('videoFile').ref(e);
                  fileInputRef.current = e;
                }}
              />
              
              <UploadCloud 
                size={48} 
                className={`mb-4 transition duration-300 ${
                  isDragActive ? 'text-zinc-200 animate-bounce' : 'text-zinc-500'
                }`} 
              />
              
              <h3 className="text-lg font-semibold text-white mb-1.5">
                {selectedFile ? 'Change Selected File' : 'Drag & Drop Video here'}
              </h3>
              <p className="text-zinc-400 text-xs font-normal">
                or click to browse local files on your computer
              </p>
            </div>

            {/* Error Message for Input */}
            {errors.videoFile && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center">
                {errors.videoFile.message}
              </div>
            )}

            {/* Selected File Details Dashboard */}
            {selectedFile && !uploading && (
              <div className="p-4 bg-[#18181b]/60 border border-[#27272a] rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-10 w-10 bg-zinc-800 border border-zinc-700/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileVideo size={20} className="text-zinc-300" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-sm font-semibold text-white block truncate">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {formatFileSize(selectedFile.size)}
                    </span>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    reset();
                  }}
                  className="p-2 border border-[#27272a] hover:border-rose-500/40 text-zinc-400 hover:text-rose-400 rounded-lg transition duration-150"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            {/* Upload Progress Animation */}
            {uploading && (
              <div className="p-5 bg-[#18181b]/40 border border-[#27272a] rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 flex items-center gap-2 font-medium">
                    <Loader2 className="animate-spin text-zinc-300" size={14} />
                    Sending to Cloudinary...
                  </span>
                  <span className="font-bold text-white">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-zinc-100 h-full rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.root && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl text-center">
                {errors.root.message}
              </div>
            )}

            {/* Upload Action Button */}
            {!uploading && selectedFile && (
              <button
                type="submit"
                className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold py-3.5 rounded-xl shadow-lg shadow-zinc-500/5 hover:shadow-zinc-500/10 active:scale-[0.99] transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer"
              >
                Upload Video Solution
              </button>
            )}

          </form>

          {/* Success Message & Real Video Player Preview */}
          {uploadedVideo && (
            <div className="mt-8 pt-8 border-t border-[#27272a] space-y-4 animate-fade-in">
              <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-base">
                <CheckCircle2 size={20} />
                Upload Successful!
              </div>
              
              {/* Native HTML5 Video Preview player */}
              <div className="rounded-2xl overflow-hidden border border-[#27272a] bg-[#000] shadow-inner relative aspect-video">
                <video 
                  src={uploadedVideo.secureUrl} 
                  controls 
                  preload="metadata"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Upload Metadata Dashboard */}
              <div className="grid grid-cols-2 gap-3.5 bg-[#18181b]/30 border border-[#27272a] p-4 rounded-xl text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-zinc-500" />
                  <span>
                    <strong>Duration:</strong> {formatDuration(uploadedVideo.duration)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-zinc-500" />
                  <span>
                    <strong>Uploaded:</strong> {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-2 border-t border-[#27272a]/55 pt-2.5 mt-1">
                  <Sparkles size={14} className="text-zinc-500" />
                  <span className="truncate">
                    <strong>Public ID:</strong> {uploadedVideo.cloudinaryPublicId}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminUpload;
