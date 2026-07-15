import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { FiVolume2 } from "react-icons/fi";
import { FiVolumeX } from "react-icons/fi";
import dp from "../assets/dp.webp"
import FollowButton from './FollowButton';
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineComment } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { setLoopData } from '../redux/loopSlice';
import axios from 'axios';
import { serverUrl } from '../App';
import { IoSendSharp } from "react-icons/io5";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
function LoopCard({ loop }) {
    const videoRef = useRef()
const [isPlaying,setIsPlaying]=useState(true)
const [isMute,setIsMute]=useState(false)
const [progress,setProgress]=useState(0)
const {userData}=useSelector(state=>state.user)
const {socket}=useSelector(state=>state.socket)
const {loopData}=useSelector(state=>state.loop)
const [showHeart,setShowHeart]=useState(false)
const [showComment,setShowComment]=useState(false)
const [message,setMessage]=useState("")
const dispatch=useDispatch()
const commentRef=useRef()
const handleTimeUpdate=()=>{
    const video = videoRef.current
    if(video){
        const percent=(video.currentTime / video.duration)*100
        setProgress(percent)
    }
}
const handleLikeOnDoubleClick=()=>{
    setShowHeart(true)
    setTimeout(()=>setShowHeart(false),6000)
    {!loop.likes?.includes(userData._id)?handleLike():null }
}

const handleClick=()=>{
    if(isPlaying){
        videoRef.current.pause()
        setIsPlaying(false)
    }else{
        videoRef.current.play()
        setIsPlaying(true)
    }
}

const handleLike=async ()=>{
    try {
      const result=await axios.get(`${serverUrl}/api/loop/like/${loop._id}`,{withCredentials:true})
      const updatedLoop=result.data

      const updatedLoops=loopData.map(p=>p._id==loop._id?updatedLoop:p)
      dispatch(setLoopData(updatedLoops))
    } catch (error) {
      console.log(error)
    }
  }
  const handleComment=async ()=>{
    
    try {
      const result=await axios.post(`${serverUrl}/api/loop/comment/${loop._id}`,{message},{withCredentials:true})
      const updatedLoop=result.data

      const updatedLoops=loopData.map(p=>p._id==loop._id?updatedLoop:p)
      dispatch(setLoopData(updatedLoops))
      setMessage("")
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete=async ()=>{
    if(window.confirm("Are you sure you want to delete this loop?")){
      try {
        await axios.delete(`${serverUrl}/api/loop/delete/${loop._id}`,{withCredentials:true})
        const updatedLoops=loopData.filter(p=>p._id!==loop._id)
        dispatch(setLoopData(updatedLoops))
      } catch (error) {
        console.log(error.response)
        alert(error.response?.data?.message || "Failed to delete loop")
      }
    }
  }
 

useEffect(()=>{
const handleClickOutside=(event)=>{
if(commentRef.current && !commentRef.current.contains(event.target) ){
    setShowComment(false)
}
}

if(showComment){
    document.addEventListener("mousedown",handleClickOutside)
}else{
    document.removeEventListener("mousedown",handleClickOutside)
}

},[showComment])




    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            const video = videoRef.current
            if (entry.isIntersecting) {
                video.play()
                setIsPlaying(true)
            } else {
                video.pause()
                setIsPlaying(false)
            }
        }, { threshold: 0.6 })
        if (videoRef.current) {
            observer.observe(videoRef.current)
        }

        return ()=>{
             if (videoRef.current) {
            observer.unobserve(videoRef.current)
        }
        }

    }, [])


    useEffect(()=>{
        socket?.on("likedLoop",(updatedData)=>{
         const updatedLoops=loopData.map(p=>p._id==updatedData.loopId?{...p,likes:updatedData.likes}:p)
         dispatch(setLoopData(updatedLoops))
        })
    socket?.on("commentedLoop",(updatedData)=>{
         const updatedLoops=loopData.map(p=>p._id==updatedData.loopId?{...p,comments:updatedData.comments}:p)
         dispatch(setLoopData(updatedLoops))
        })
    socket?.on("deletedLoop",(data)=>{
         const updatedLoops=loopData.filter(p=>p._id!==data.loopId)
         dispatch(setLoopData(updatedLoops))
        })
    
        return ()=>{socket?.off("likedLoop")
                   socket?.off("commentedLoop")
                   socket?.off("deletedLoop")}
      },[socket,loopData,dispatch])
    return (
        <div className='w-full lg:w-[480px] h-[100vh] flex items-center justify-center border-l-2 border-r-2 border-gray-800  relative overflow-hidden'>

{showHeart && <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation  z-50'>
   <GoHeartFill className='w-[100px]  h-[100px] text-white drop-shadow-2xl' /> 
</div>}

<div ref={commentRef} className={`absolute z-[200] bottom-0 w-full h-[500px] p-[10px]  rounded-t-4xl bg-[#0e1718] transform transition-transform duration-500 ease-in-out left-0 shadow-2xl shadow-black ${showComment?"translate-y-0":"translate-y-[100%] "}`}>
<h1 className='text-white text-[20px] text-center font-semibold'>Comments</h1>

<div className='w-full h-[350px] overflow-y-auto flex flex-col gap-[20px]'>

    {loop.comments.length==0 && <div className='text-center text-white text-[20px] font-semibold mt-[50px]'>No Comments Yet</div>}

{loop.comments?.map((com,index)=>(
<div className='w-full  flex flex-col gap-[5px] border-b-[1px] border-gray-800 justify-center pb-[10px] mt-[10px]'>
<div className='flex justify-start items-center md:gap-[20px] gap-[10px]'>
          <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
            <img src={com.author?.profileImage || dp} alt="" className='w-full object-cover' />
          </div>
          <div className='w-[150px] font-semibold text-white truncate'>{com.author?.userName}</div>
        </div>
        <div className='text-white pl-[60px]'>{com.message}</div>
</div>
))}
</div>
 <div className='w-full fixed bottom-0 h-[80px] flex items-center justify-between px-[20px] py-[20px] '>
          <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden '>
            <img src={loop.author?.profileImage || dp} alt="" className='w-full object-cover ' />
          </div>
          <input type="text" className='px-[10px] border-b-2 border-b-gray-500 w-[90%] text-white placeholder:text-white outline-none h-[40px]' placeholder='Write comment...' onChange={(e)=>setMessage(e.target.value)} value={message}/>
          {message &&  <button className='absolute right-[20px] cursor-pointer' onClick={handleComment}><IoSendSharp className='w-[25px] h-[25px] text-white'/></button>}
         
          </div>
</div>



            <video ref={videoRef} autoPlay muted={isMute} loop src={loop?.media} className='w-full max-h-full' onClick={handleClick} onTimeUpdate={handleTimeUpdate} onDoubleClick={handleLikeOnDoubleClick}/>
            <div className='absolute top-[20px] z-[100] right-[20px] ' onClick={()=>setIsMute(prev=>!prev)}>
   {!isMute?<FiVolume2 className='w-[20px] h-[20px] text-white font-semibold'/>:<FiVolumeX className='w-[20px] h-[20px] text-white font-semibold'/>}
            </div>
            <div className='absolute bottom-0  w-full h-[5px] bg-gray-900'>
<div className='h-full w-[200px] bg-white transition-all duration-200 ease-linear' style={{width:`${progress}%`}}>
</div>
            </div>

            <div className='w-full absolute h-auto min-h-[100px] bottom-[10px] p-[10px] flex flex-col gap-[8px] bg-gradient-to-t from-black/85 via-black/55 to-transparent z-[10] text-left'>
<div className='flex items-center gap-[5px]'>
          <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden' >
            <img src={loop.author?.profileImage || dp} alt="" className='w-full object-cover' />
          </div>
          <div className='flex flex-col truncate'>
            <div className='w-[120px] font-semibold truncate text-white '>{loop.author.name || loop.author.userName}</div>
            <div className='text-[11px] text-gray-300 truncate'>
              {loop.author.department ? `${loop.author.department} • ` : ''}{loop.author.year}
            </div>
          </div>
       
        {userData._id!=loop.author._id && <FollowButton targetUserId={loop.author?._id} tailwind={"px-[10px] py-[5px] text-white border-2 text-[14px] rounded-2xl border-white"}/>}
        {userData._id==loop.author._id && <MdDelete className='w-[20px] h-[20px] cursor-pointer text-red-600 hover:text-red-800' onClick={handleDelete} title="Delete loop"/>}
         </div>
         {loop.projectTitle && (
             <div className='text-white font-bold text-[17px] px-[10px]'>
                 {loop.projectTitle}
             </div>
         )}
         <div className='text-white px-[10px] text-[14px]'>
            {loop.caption}
         </div>
         {loop.techStack && (
             <div className='flex flex-wrap gap-[5px] px-[10px] mt-[1px]'>
                 {loop.techStack.split(',').map((tech, i) => (
                     <span key={i} className='bg-white/20 text-white px-[6px] py-[1px] rounded-md text-[11px] font-medium'>{tech.trim()}</span>
                 ))}
             </div>
         )}
         {(loop.githubLink || loop.linkedinLink || loop.portfolioLink) && (
            <div className='flex flex-wrap gap-[8px] mt-[4px] px-[10px] z-[20]'>
               {loop.githubLink && (
                   <a href={loop.githubLink.startsWith('http') ? loop.githubLink : `https://${loop.githubLink}`} target="_blank" rel="noopener noreferrer" className='flex items-center gap-[6px] text-[12px] bg-gray-900/90 hover:bg-gray-800 text-white px-[8px] py-[4px] rounded-full transition-colors border border-gray-700 shadow-md'>
                       <FaGithub className='w-[14px] h-[14px]' />
                       <span>GitHub</span>
                   </a>
               )}
               {loop.linkedinLink && (
                   <a href={loop.linkedinLink.startsWith('http') ? loop.linkedinLink : `https://${loop.linkedinLink}`} target="_blank" rel="noopener noreferrer" className='flex items-center gap-[6px] text-[12px] bg-blue-900/90 hover:bg-blue-800 text-white px-[8px] py-[4px] rounded-full transition-colors border border-blue-700 shadow-md'>
                       <FaLinkedin className='w-[14px] h-[14px]' />
                       <span>LinkedIn</span>
                   </a>
               )}
               {loop.portfolioLink && (
                   <a href={loop.portfolioLink.startsWith('http') ? loop.portfolioLink : `https://${loop.portfolioLink}`} target="_blank" rel="noopener noreferrer" className='flex items-center gap-[6px] text-[12px] bg-teal-900/90 hover:bg-teal-800 text-white px-[8px] py-[4px] rounded-full transition-colors border border-teal-700 shadow-md'>
                       <FaGlobe className='w-[14px] h-[14px]' />
                       <span>Website</span>
                   </a>
               )}
            </div>
         )}

         <div className='absolute right-0 flex flex-col gap-[20px] text-white  bottom-[150px] justify-center px-[10px] '>
<div className='flex flex-col items-center cursor-pointer'>
    <div onClick={handleLike}>
        {!loop.likes.includes(userData._id) && <GoHeart className='w-[25px] cursor-pointer h-[25px]'/>}
                   {loop.likes.includes(userData._id) && <GoHeartFill className='w-[25px] cursor-pointer h-[25px] text-red-600' />} 
    </div>
    <div >{loop.likes.length}</div>
</div>
<div className='flex flex-col items-center cursor-pointer' onClick={()=>setShowComment(true)}>
    <div><MdOutlineComment className='w-[25px] cursor-pointer h-[25px]'/></div>
    <div>{loop.comments.length}</div>
</div>

         </div>
            </div>
        </div>
    )
}

export default LoopCard
