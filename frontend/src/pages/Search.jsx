import React, { useEffect, useState } from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { FiSearch } from "react-icons/fi";
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchData } from '../redux/userSlice';
import dp from "../assets/dp.webp"
import { FaGithub, FaLinkedin } from "react-icons/fa"
function Search() {
    const navigate=useNavigate()
    const[input,setInput]=useState(null)
    const [searchData,setSearchData]=useState()
    const dispatch=useDispatch()
    const handleSearch=async ()=>{
     
        try {
            const result=await axios.get(`${serverUrl}/api/user/search?keyWord=${input}`,{withCredentials:true})
           setSearchData(result.data)
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        if(input){
  handleSearch()
        }
   
    },[input])
    console.log(searchData)
  return (
    <div className='w-full min-h-[100vh] bg-[#00509d] flex items-center flex-col gap-[20px] '>
       <div className='w-full h-[80px]  flex items-center gap-[20px] px-[20px] absolute top-0 '>
                      <MdOutlineKeyboardBackspace className='text-white cursor-pointer w-[25px]  h-[25px] ' onClick={() => navigate(`/`)} />
                 
                  </div>
                  <div className='w-full h-[80px] flex items-center justify-center mt-[80px]'>
 <div className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#0f1414] flex items-center px-[20px]' >
<FiSearch className='w-[18px] h-[18px] text-white'/>
                    <input type="text" placeholder='search...' className='w-full h-full outline-0 rounded-full px-[20px] text-white text-[18px]' onChange={(e)=>setInput(e.target.value)} value={input}/>
                  </div>
                  </div>
   {input &&  searchData?.map((user, index)=>(
     <div 
        key={index}
        className='w-[90vw] max-w-[700px] bg-white border border-gray-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-[15px] p-[15px] cursor-pointer hover:bg-gray-50 hover:shadow-md transition-all mb-3' 
        onClick={()=>navigate(`/profile/${user.userName}`)}
     >
        <div className='flex items-center gap-[15px] w-full sm:w-auto'>
            <div className='w-[60px] h-[60px] border-2 border-gray-300 rounded-full cursor-pointer overflow-hidden flex-shrink-0' >
                <img src={user.profileImage || dp} alt="" className='w-full h-full object-cover'/>
            </div>

            <div className='text-black flex flex-col text-left truncate'>
                <div className='flex items-center gap-[6px] justify-start'>
                    <span className='font-bold text-[17px] text-gray-900'>{user.name}</span>
                    {user.rollNumber && <span className='text-[12px] bg-gray-100 text-gray-600 px-[6px] py-[2px] rounded-md font-mono'>{user.rollNumber}</span>}
                </div>
                <div className='text-[14px] text-gray-500 font-medium'>@{user.userName}</div>
                <div className='text-[13px] text-gray-600 mt-[2px]'>
                    {user.department ? `${user.department} • ` : ''}{user.year}
                </div>
            </div>
        </div>
        
        {/* Quick Social & Info Shortcuts */}
        <div className='flex items-center gap-[15px] ml-auto sm:ml-0' onClick={(e)=>e.stopPropagation()}>
            <div className='text-gray-500 text-[13px] font-semibold flex gap-[10px]'>
                <span>{user.followers?.length || 0} Followers</span>
                <span>{user.posts?.length || 0} Posts</span>
            </div>
            <div className='flex gap-[10px] text-[20px]'>
                {user.github && (
                    <a href={user.github.startsWith('http') ? user.github : `https://${user.github}`} target="_blank" rel="noopener noreferrer" className='text-gray-950 hover:text-gray-700 transition-colors'>
                        <FaGithub />
                    </a>
                )}
                {user.linkedin && (
                    <a href={user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`} target="_blank" rel="noopener noreferrer" className='text-blue-600 hover:text-blue-400 transition-colors'>
                        <FaLinkedin />
                    </a>
                )}
            </div>
        </div>
     </div>
   ))}   

{!input && <div className='text-[30px] text-gray-700 font-bold'>Search Here...</div>}

                  
                  
    </div>
  )
}

export default Search
