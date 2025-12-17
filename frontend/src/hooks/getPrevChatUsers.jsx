import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/userSlice'
import { setCurrentUserStory } from '../redux/storySlice'
import { setPrevChatUsers } from '../redux/messageSlice'

function getPrevChatUsers() {
    const dispatch=useDispatch()
    const {messages}=useSelector(state=>state.message)
  useEffect(()=>{
const fetchUser=async ()=>{
  try {
    const url = new URL('/api/message/prevChats', serverUrl).toString()
    const result=await axios.get(url,{withCredentials:true})
    if (!result || !('data' in result)) { console.log('empty response', result); return }
    const data = result.data.payload ?? result.data
     dispatch(setPrevChatUsers(data))
     console.log(data)
  } catch (error) {
    console.log(error)
  }
}
fetchUser()
  },[messages])
}

export default getPrevChatUsers
