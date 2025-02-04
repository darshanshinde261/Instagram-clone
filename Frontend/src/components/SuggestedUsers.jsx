import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar"
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { setFollow } from '@/redux/chatSlice'

const SuggestedUsers = () => {
    
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.auth)
    useGetUserProfile(user?._id)
    const {userProfile} = useSelector((state) => state.auth);
    const { suggestedUsers } = useSelector((state) => state.auth);
    const {follow} = useSelector((state)=>state.chat)
    const handleFollow = async(userid) => {
        try{
            const res = await axios.post(`http://localhost:4000/api/v1/user/followorunfollow/${userid}`,null,{withCredentials:true});
            toast.success(res?.data?.message);
            dispatch(setFollow(!follow))
        }catch(error){
            console.log(error);
        }
    }
    return (
        <div className='my-10 '>
            <div className='flex text-sm items-center justify-between'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer '>See All</span>
            </div>
            {
                suggestedUsers?.map((user) => {
                    return (
                        <div key={user?._id} className='flex my-5 justify-between items-center'>
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${user?._id}`}>
                                    <Avatar>
                                        <AvatarImage src={user?.profilePicture} alt='post_img' className='object-cover'></AvatarImage>
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className='font-semibold text-sm'>{user?.username}</h1>
                                    <span className='text-gray-600 text-sm'>{user?.bio || "bio here.."}</span>
                                </div>
                            </div>
                            <span className='text-[#3BADF8] text-sm font-bold cursor-pointer hover:text-[#0f93eb]' onClick={()=>handleFollow(user?._id)}>{`${userProfile?.following?.some(id => id===user?._id) ? "unfollow":"follow"} `}</span>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SuggestedUsers