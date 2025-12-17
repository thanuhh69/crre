import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setSuggestedUsers, setUserData } from '../redux/userSlice'

function getSuggestedUsers() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
  useEffect(()=>{
const fetchUser=async ()=>{
  try {
    const url = new URL('/api/user/suggested', serverUrl).toString()
    const result=await axios.get(url,{withCredentials:true})
    if (!result || !('data' in result)) { console.log('empty response', result); return }
    const data = result.data.payload ?? result.data
     dispatch(setSuggestedUsers(data))
  } catch (error) {
    console.log(error)
  }
}
fetchUser()
  },[userData])
}

export default getSuggestedUsers
