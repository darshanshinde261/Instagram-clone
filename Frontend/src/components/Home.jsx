import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import SideBar from './SideBar'
import useGetAllPost from '@/hooks/useGetAllPost'
import RightSideBar from './RightSideBar'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUser'

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed></Feed>
        <Outlet></Outlet>
      </div>
      {/* <SideBar></SideBar> */}
      <RightSideBar></RightSideBar>
    </div>
  )
}

export default Home