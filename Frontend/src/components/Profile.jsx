import React, { useEffect, useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { Heart, MessageCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { Button } from './ui/button'
import { AtSign } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const navigate = useNavigate()
  useGetUserProfile(userId);
  const [active, setActive] = useState("POSTS")
  const { userProfile, user } = useSelector((state) => state.auth);
 
  const [isFollwing,setIsFollwing] = useState(user?.following?.includes(userProfile._id) ? true : false);
  const displayPost = active === "POSTS" ? userProfile?.posts : userProfile?.bookmarks;
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const handleClick = async () => {
    try {
      const res = await axios.post(`http://localhost:4000/api/v1/user/followorunfollow/${userId}`, null, { withCredentials: true });
      toast.success(res?.data?.message);
      setIsFollwing(!isFollwing)
    } catch (error) {
      console.log(error);
    }
  }

  const handleTabChange = (tab) => {
    setActive(tab);
  }

  return (
    <div className='flex max-w-6xl flex-col justify-center mx-auto pl-10'>
      <div className='grid sm:grid-cols-2 grid-cols-1'>
        <div className='flex flex-col gap-20 p-8'>
          <section className='flex items-center justify-center'>
            <Avatar className='h-32 w-32'>
              <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" className='object-cover'>
              </AvatarImage>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
        </div>
        <section>
          <div className='flex flex-col gap-5 mt-4'>
            <div className='lg:flex items-center '>
              <span>{userProfile?.username} </span>
              {
                isLoggedInUserProfile ?
                  (<div className='flex gap-2 ml-2'>
                    <Link to='/account/edit'><Button variant="secondary" className='hover:bg-gray-200'>Edit profile</Button></Link>
                    <Button variant="secondary" className='hover:bg-gray-200'>View Archiew</Button>
                    <Button variant="secondary" className='hover:bg-gray-200'>Add tools</Button>
                  </div>) :
                  (
                    isFollwing ? (
                      <>
                        <Button variant="secondary" onClick={()=>handleClick()}>Unfollow</Button>
                        <Button variant="secondary" onClick={()=>navigate("/chat")}>Message</Button>
                      </>)
                      :
                      (<Button variant="secondary" className='bg-[#06a393] hover:bg-[#0befd8]' onClick={()=>handleClick()}>follow</Button>)
                  )
              }

            </div>
            <div className='flex items-center gap-4'>
              <p><span className='font-semibold'>{userProfile?.posts?.length} </span> posts</p>
              <p><span className='font-semibold'>{userProfile?.followers?.length} </span>followers</p>
              <p> <span className='font-semibold'>{userProfile?.following?.length}</span> following</p>
            </div>
            <div className='flex flex-col gap-1'>
              <span>{userProfile?.bio || "bio here..."}</span>
              <Badge variant="secondary" className='fit'><AtSign></AtSign> <span className='pl-1'>{userProfile?.username}</span></Badge>
              <span>Learn what ever you want</span>
              <span>Learn what ever you want</span>
              <span>Learn what ever you want</span>
            </div>
          </div>
        </section>
      </div>
      <div className='border-t border-t-gray-200 max-w-5xl lg:ml-28 ml-4 mt-8 '>
        <div className='flex items-center justify-center gap-10'>
          <span className={`my-3 cursor-pointer ${active === "POSTS" ? "font-bold" : ""}`} onClick={() => handleTabChange("POSTS")}>
            POSTS
          </span>
          <span className={`my-3 cursor-pointer ${active === "SAVED" ? "font-bold" : ""}`} onClick={() => handleTabChange("SAVED")}>
            SAVED
          </span>
          <span className={`my-3 cursor-pointer ${active === "REELS" ? "font-bold" : ""}`} onClick={() => handleTabChange("REELS")}>
            REELS
          </span>
          <span className={`my-3 cursor-pointer ${active === "TAGS" ? "font-bold" : ""}`} onClick={() => handleTabChange("TAGS")}>
            TAGS
          </span>
        </div>
        <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-1'>
          {
            displayPost?.map((post) => {
              return (
                <div key={post?._id} className='relative group cursor-pointer'>
                  <img src={post?.image} alt="[pstimage" className='rounded-sm my-2 w-full aspect-square object-cover' />
                  <div className='absolute inset-0 flex items-center justify-center bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-200'>
                    <div className='flex items-center text-white space-x-2'>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        <Heart></Heart>
                        <span>{post?.likes?.length}</span>
                      </button>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        <MessageCircle></MessageCircle>
                        <span>{post?.comments?.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>

      </div>
    </div>
  )
}

export default Profile