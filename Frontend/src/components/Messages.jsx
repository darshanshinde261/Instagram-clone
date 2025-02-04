import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'

const Messages = ({ selectedUser }) => {
    useGetRTM();
    const {user} = useSelector((state)=>state.auth)
    useGetAllMessage();
    const {messages} = useSelector((state)=>state.chat);
    
    return (
        <div className='overflow-y-auto flex-1 p-4 '>
            <div className='flex justify-center'>
                <div className='flex flex-col items-center justify-center'>
                    <Avatar className='h-20 w-20'>
                        <AvatarImage src={selectedUser?.profilePicture} className='object-cover'></AvatarImage>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?._id}`}><Button variant="secondary">View Profile</Button></Link>

                </div>

            </div>
            <div className='flex flex-col gap-3'>
                {
                messages?.map((msg) =>{
                    return (
                        <div key={msg?._id} className={`flex ${msg.senderId === user?._id ? 'justify-end':'justify-start'}`}>
                            <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user?._id ? 'bg-blue-500 text-white':'bg-gray-200 text-black'}`}>
                                {msg.textMessage}
                            </div>
                        </div>
                    )
                    }
                    )
                }
            </div>

        </div>
    )
}

export default Messages