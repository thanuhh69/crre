import React from 'react'
import LeftHome from '../components/LeftHome'
import Feed from '../components/Feed'

function Home() {
  return (
    <div className='w-full flex justify-center items-center'>
      <LeftHome/>
      <Feed/>
    </div>
  )
}

export default Home
