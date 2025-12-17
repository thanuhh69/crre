import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/userSlice'
import { setCurrentUserStory } from '../redux/storySlice'

function getCurrentUser() {
    const dispatch=useDispatch()
    const {storyData}=useSelector(state=>state.story)
  useEffect(()=>{
const fetchUser=async ()=>{
  try {
    const url = new URL('/api/user/current', serverUrl).toString()
    const result=await axios.get(url,{withCredentials:true})
    if (!result || !('data' in result)) { console.log('empty response', result); return }
    const data = result.data.payload ?? result.data
     dispatch(setUserData(data))
     dispatch(setCurrentUserStory(data.story))
  } catch (error) {
    console.log(error)
  }
}
fetchUser()
  },[storyData])
}

export default getCurrentUser
