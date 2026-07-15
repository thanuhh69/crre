import React, { useState } from 'react'

import { FaRegHeart } from "react-icons/fa6";
import dp from "../assets/dp.webp"
import logo from "../assets/logo.jpeg"
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import OtherUser from './OtherUser';
import Notifications from '../pages/Notifications';
function LeftHome() {

    const {userData ,suggestedUsers}=useSelector(state=>state.user)
    const [showNotification,setShowNotification]=useState(false)
const dispatch=useDispatch()
const {notificationData}=useSelector(state=>state.user)
    const handleLogOut=async ()=>{
        try {
            const result=await axios.get(`${serverUrl}/api/auth/signout`,{withCredentials:true})
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }


  return (
    <div className={`w-[25%] hidden lg:block h-[100vh] bg-[#00509d] border-r-2 border-[#003f7a]  ${showNotification?"overflow-hidden":"overflow-auto"}`}>
      <div className='w-full h-[100px] flex items-center justify-between p-[20px]'>
        <img src={logo} alt="logo" className='w-[80px]'/>
        <div className='relative z-[100]' onClick={()=>setShowNotification(prev=>!prev)}>
      <FaRegHeart className='text-[white] w-[25px] h-[25px]'/>
      {notificationData?.length>0 && notificationData.some((noti)=>noti.isRead===false) && (<div className='w-[10px] h-[10px] bg-[#ffd100] rounded-full absolute top-0 right-[-5px]'></div>)}
     
        </div>
      </div>

      {!showNotification && <>
<div className='flex items-center w-full justify-between gap-[10px] px-[10px] border-b-2 border-b-[#003f7a] py-[10px]'>
        <div className='flex items-center gap-[10px]'>
<div className='w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
    <img src={userData.profileImage || dp} alt="" className='w-full object-cover'/>
</div>
<div >
    <div className='text-[18px] text-white font-semibold '>{userData.userName}</div>
    <div className='text-[15px] text-gray-200 font-semibold '>{userData.name}</div>
</div>
</div>
<div className='bg-[#ffd100] text-black font-bold px-[15px] py-[6px] rounded-full cursor-pointer hover:bg-[#e6bd00] transition-colors shadow-sm' onClick={handleLogOut}>Log Out</div>
      </div>

<div className='w-full flex flex-col gap-[20px] p-[20px]'>
    <h1 className='text-[white] text-[19px]'>Suggested Users</h1>
    {suggestedUsers && suggestedUsers.slice(0,3).map((user,index)=>(
        <OtherUser key={index} user={user}/>
    ))}
</div>
      </>}

      {showNotification && <Notifications/>}
      


    </div>
  )
}

export default LeftHome
