import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/userSlice'
import { setStoryList } from '../redux/storySlice'

function getAllStories() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
     const {storyData}=useSelector(state=>state.story)
  useEffect(()=>{
const fetchStories=async ()=>{
  try {
    const url = new URL('/api/story/getAll', serverUrl).toString()
    const result=await axios.get(url,{withCredentials:true})
    if (!result || !('data' in result)) { console.log('empty response', result); return }
    const data = result.data.payload ?? result.data
     dispatch(setStoryList(data))
        
  } catch (error) {
    console.log(error)
  }
}
fetchStories()
  },[userData,storyData])
}

export default getAllStories
