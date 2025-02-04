import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers'

const RightSideBar = () => {
    const { user } = useSelector((state) => state.auth)
    return (
        <div className='w-fit my-10  lg:pr-32 pr-8 '>
            <div className='flex items-center gap-2'>
                <Link to={`/profile/${user?._id}`}>
                    <Avatar>
                        <AvatarImage src={user?.profilePicture} alt='post_img' className='object-cover'></AvatarImage>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </Link>
                <div>
                    <Link to={`/profile/${user?._id}`}>
                        <h1 className='font-semibold text-sm'>{user?.username}</h1>
                        <span className='text-gray-600 text-sm'>{user?.bio || "bio here.."}</span>
                    </Link>
                </div>

            </div>
            <SuggestedUsers></SuggestedUsers>
        </div>
    )
}

export default RightSideBar