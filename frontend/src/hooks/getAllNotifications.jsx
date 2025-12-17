import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setNotificationData, setUserData } from '../redux/userSlice'
import { setPostData } from '../redux/postSlice'

function getAllNotifications() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
  useEffect(()=>{
const fetchNotifications=async ()=>{
  try {
    const url = new URL('/api/user/getAllNotifications', serverUrl).toString()
    const result=await axios.get(url,{withCredentials:true})
    if (!result || !('data' in result)) { console.log('empty response', result); return }
    const data = result.data.payload ?? result.data
     dispatch(setNotificationData(data))
  } catch (error) {
    console.log(error)
  }
}
fetchNotifications()
  },[dispatch,userData])
}

export default getAllNotifications
