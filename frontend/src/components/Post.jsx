import React, { useEffect, useState } from 'react'
import dp from "../assets/dp.webp"
import VideoPlayer from './VideoPlayer'
import { GoHeart } from "react-icons/go";
import { FaGithub, FaLinkedin, FaExternalLinkAlt, FaFilePdf } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { GoHeartFill } from "react-icons/go";
import { MdOutlineComment } from "react-icons/md";
import { MdOutlineBookmarkBorder } from "react-icons/md";
import { GoBookmarkFill } from "react-icons/go";
import { IoSendSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { serverUrl } from '../App';
import { setPostData } from '../redux/postSlice';
import { setUserData } from '../redux/userSlice';
import FollowButton from './FollowButton';
import { useNavigate } from 'react-router-dom';
function Post({ post }) {
  const { userData } = useSelector(state => state.user)
  const { postData } = useSelector(state => state.post)
  const { socket } = useSelector(state => state.socket)
  const [showComment, setShowComment] = useState(false)
  const [message,setMessage]=useState("")
  const navigate=useNavigate()
const dispatch=useDispatch()
  const handleLike=async ()=>{
    try {
      const result=await axios.get(`${serverUrl}/api/post/like/${post._id}`,{withCredentials:true})
      const updatedPost=result.data

      const updatedPosts=postData.map(p=>p._id==post._id?updatedPost:p)
      dispatch(setPostData(updatedPosts))
    } catch (error) {
      console.log(error)
    }
  }

 const handleComment=async ()=>{
    try {
      const result=await axios.post(`${serverUrl}/api/post/comment/${post._id}`,{message},{withCredentials:true})
      const updatedPost=result.data

      const updatedPosts=postData.map(p=>p._id==post._id?updatedPost:p)
      dispatch(setPostData(updatedPosts))
    } catch (error) {
      console.log(error.response)
    }
  }

  const handleSaved=async ()=>{
    try {
      const result=await axios.get(`${serverUrl}/api/post/saved/${post._id}`,{withCredentials:true})
      dispatch(setUserData(result.data))
    } catch (error) {
      console.log(error.response)
    }
  }

  const handleDelete=async ()=>{
    if(window.confirm("Are you sure you want to delete this post?")){
      try {
        await axios.delete(`${serverUrl}/api/post/delete/${post._id}`,{withCredentials:true})
        const updatedPosts=postData.filter(p=>p._id!==post._id)
        dispatch(setPostData(updatedPosts))
      } catch (error) {
        console.log(error.response)
        alert(error.response?.data?.message || "Failed to delete post")
      }
    }
  }
  
  useEffect(()=>{
    socket?.on("likedPost",(updatedData)=>{
     const updatedPosts=postData.map(p=>p._id==updatedData.postId?{...p,likes:updatedData.likes}:p)
     dispatch(setPostData(updatedPosts))
    })
socket?.on("commentedPost",(updatedData)=>{
     const updatedPosts=postData.map(p=>p._id==updatedData.postId?{...p,comments:updatedData.comments}:p)
     dispatch(setPostData(updatedPosts))
    })
socket?.on("deletedPost",(data)=>{
     const updatedPosts=postData.filter(p=>p._id!==data.postId)
     dispatch(setPostData(updatedPosts))
    })

    return ()=>{socket?.off("likedPost")
               socket?.off("CommentedPost")
               socket?.off("deletedPost")}
  },[socket,postData,dispatch])
  return (
    <div className='w-[90%]   flex flex-col gap-[10px] bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl pb-[20px]'>
      <div className='w-full h-[80px] flex justify-between items-center px-[10px]'>
        <div className='flex justify-center items-center md:gap-[20px] gap-[10px] cursor-pointer' onClick={()=>navigate(`/profile/${post.author?.userName}`)}>
          <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
            <img src={post.author?.profileImage || dp} alt="" className='w-full object-cover' />
          </div>
          <div className='flex flex-col truncate'>
            <div className='font-semibold text-black truncate'>{post.author.name || post.author.userName}</div>
            <div className='text-[12px] text-gray-500 truncate'>
              {post.author.department ? `${post.author.department} • ` : ''}{post.author.year}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-[10px]">
          <span className="text-[12px] font-bold bg-blue-100 text-blue-700 px-[8px] py-[4px] rounded-full border border-blue-200">
            {post.category || "Post"}
          </span>
          {userData._id!=post.author._id &&  <FollowButton tailwind={'px-[10px] min-w-[60px] md:min-w-[100px] py-[5px] h-[30px] md:h-[40px] bg-[black] text-white rounded-2xl text-[14px] md:text-[16px]'} targetUserId={post.author._id}/>}
          {userData._id==post.author._id && <MdDelete className='w-[25px] h-[25px] cursor-pointer text-red-600 hover:text-red-800' onClick={handleDelete} title="Delete post"/>}
        </div>
      </div>

      {/* Dynamic Project/Certificate details */}
      <div className='w-[90%] flex flex-col gap-[10px] text-black px-[10px] py-[5px]'>
        {/* If Project Related */}
        {["Project", "Workshop", "Hackathon", "Technical Blog", "Event"].includes(post.category) && post.projectTitle && (
            <div className='bg-gray-50 border border-gray-100 p-[15px] rounded-xl flex flex-col gap-[8px] text-left'>
                <h3 className='font-bold text-[18px] text-gray-900'>{post.projectTitle}</h3>
                {post.techStack && (
                    <div className='flex flex-wrap gap-[5px] mt-[2px]'>
                        {post.techStack.split(',').map((tech, i) => (
                            <span key={i} className='bg-gray-200 text-gray-700 px-[8px] py-[2px] rounded-md text-[12px] font-medium'>{tech.trim()}</span>
                        ))}
                    </div>
                )}
                <div className='flex flex-wrap gap-[10px] mt-[5px]'>
                    {post.githubRepo && (
                        <a href={post.githubRepo.startsWith('http') ? post.githubRepo : `https://${post.githubRepo}`} target="_blank" rel="noopener noreferrer" className='flex items-center gap-[5px] bg-gray-900 hover:bg-gray-800 text-white text-[13px] px-[10px] py-[6px] rounded-lg transition-colors font-medium'>
                            <FaGithub /> GitHub
                        </a>
                    )}
                    {post.liveDemo && (
                        <a href={post.liveDemo.startsWith('http') ? post.liveDemo : `https://${post.liveDemo}`} target="_blank" rel="noopener noreferrer" className='flex items-center gap-[5px] bg-blue-600 hover:bg-blue-500 text-white text-[13px] px-[10px] py-[6px] rounded-lg transition-colors font-medium'>
                            <FaExternalLinkAlt /> Live Demo
                        </a>
                    )}
                    {post.linkedinPost && (
                        <a href={post.linkedinPost.startsWith('http') ? post.linkedinPost : `https://${post.linkedinPost}`} target="_blank" rel="noopener noreferrer" className='flex items-center gap-[5px] bg-sky-700 hover:bg-sky-600 text-white text-[13px] px-[10px] py-[6px] rounded-lg transition-colors font-medium'>
                            <FaLinkedin /> LinkedIn Post
                        </a>
                    )}
                </div>
            </div>
        )}

        {/* If Certificate Related */}
        {["Certificate", "Internship", "Research Paper", "Achievement"].includes(post.category) && post.projectTitle && (
            <div className='bg-blue-50/50 border border-blue-100 p-[15px] rounded-xl flex flex-col gap-[6px] text-left'>
                <h3 className='font-bold text-[18px] text-blue-900'>{post.projectTitle}</h3>
                {post.certificateIssuer && (
                    <div className='text-[14px] text-gray-700 font-medium'>
                        <span className='text-gray-400'>Issued By: </span>{post.certificateIssuer}
                    </div>
                )}
                {post.certificateDate && (
                    <div className='text-[13px] text-gray-500'>
                        <span className='text-gray-400'>Date: </span>{new Date(post.certificateDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                )}
            </div>
        )}

        {/* Optional PDF documentation attachment */}
        {post.pdfUrl && (
            <div className='mt-[5px]'>
                <a href={post.pdfUrl} target="_blank" rel="noopener noreferrer" className='flex items-center justify-between bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-[15px] py-[10px] rounded-xl transition-all font-medium text-[14px]'>
                    <span className='flex items-center gap-[10px]'><FaFilePdf className='text-[18px]' /> View PDF Documentation / Certificate</span>
                    <span className='text-[12px] bg-red-200 text-red-800 px-[6px] py-[2px] rounded-md'>Open</span>
                </a>
            </div>
        )}
      </div>

      <div className='w-[90%]   flex  items-center justify-center '>
        {post.media && post.mediaType == "image" && <div className='w-[90%]    flex  items-center justify-center   '>
          <img src={post.media} alt="" className='w-[80%] rounded-2xl  object-cover' />
        </div>}

        {post.media && post.mediaType == "video" && <div className='w-[80%]    flex flex-col items-center justify-center   '>
          <VideoPlayer media={post.media} />
        </div>}




      </div>

      <div className='w-full h-[60px] flex justify-between items-center px-[20px] mt-[10px]'>
        <div className='flex justify-center items-center gap-[10px] '>
          <div className='flex justify-center items-center gap-[5px]'>
            {!post.likes.includes(userData._id) && <GoHeart className='w-[25px] cursor-pointer h-[25px]' onClick={handleLike}/>}
            {post.likes.includes(userData._id) && <GoHeartFill className='w-[25px] cursor-pointer h-[25px] text-red-600' onClick={handleLike}/>}
            <span >{post.likes.length}</span>
          </div>
          <div className='flex justify-center items-center gap-[5px]' onClick={()=>setShowComment(prev=>!prev)}>
            <MdOutlineComment className='w-[25px] cursor-pointer h-[25px]' />
            <span>{post.comments.length}</span>
          </div>
        </div>
        <div onClick={handleSaved}>
          {!userData.saved.includes(post?._id) && <MdOutlineBookmarkBorder className='w-[25px] cursor-pointer h-[25px]' />}
          {userData.saved.includes(post?._id) && <GoBookmarkFill className='w-[25px] cursor-pointer h-[25px]' />}
        </div>
      </div>
      {post.caption && <div className='w-full px-[20px] gap-[10px] flex justify-start items-center '>
        <h1>{post.author.userName}</h1>
        <div>{post.caption}</div>
      </div>}

      {showComment &&
        <div className='w-full  flex flex-col gap-[30px] pb-[20px]'>
          <div className='w-full h-[80px] flex items-center justify-between px-[20px] relative'>
          <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
            <img src={post.author?.profileImage || dp} alt="" className='w-full object-cover' />
          </div>
          <input type="text" className='px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px]' placeholder='Write comment...' onChange={(e)=>setMessage(e.target.value)} value={message}/>
          <button className='absolute right-[20px] cursor-pointer' onClick={handleComment}><IoSendSharp className='w-[25px] h-[25px]'/></button>
          </div>

          <div className='w-full max-h-[300px] overflow-auto'>
            {post.comments?.map((com,index)=>(
<div key={index} className='w-full px-[20px] py-[20px]  flex items-center gap-[20px] border-b-2 border-b-gray-200'>
   <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
            <img src={com.author.profileImage || dp} alt="" className='w-full object-cover' />
          </div>
          <div>{com.message}</div>
</div>
            ))}

          </div>

        </div>
      }



    </div>
  )
}

export default Post
