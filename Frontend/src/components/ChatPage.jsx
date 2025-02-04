import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { setSelectedUser } from '@/redux/authSlice'
import { MessageCircleCode } from 'lucide-react'
import axios from 'axios'
import { Input } from './ui/input'
import { Button } from './ui/button'
import Messages from './Messages'
import { MoreHorizontal } from 'lucide-react';
import { setMessages } from '@/redux/chatSlice'
import { Dialog, DialogTrigger, DialogContent } from './ui/dialog'
import { removeMessageNotification } from '@/redux/RTN'


const ChatPage = () => {
    const [textMessage, setTextMessage] = useState('');
    const { messages } = useSelector((state) => state.chat);
    const { onlineUsers } = useSelector((state) => state.chat);
    let { messageNotification } = useSelector((state) => state.realTimeNotification)
    const dispatch = useDispatch();
    const { user, suggestedUsers, selectedUser } = useSelector((state) => state.auth);

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`https://instagram-clone-gi9m.onrender.com/api/v1/message/send/${receiverId}`, { textMessage }, {
                hearders: {
                    'content-Type': 'application/json'
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage('');
            }
        } catch (error) {
            console.log(error);
        }
    }
    const clearChatHandler = async () => {
        try {
            const res = await axios.delete(`https://instagram-clone-gi9m.onrender.com/api/v1/message/deleteall/${selectedUser?._id}`, { withCredentials: true });
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null))
        }
    }, [])
    return (
        <div className='flex lg:ml-56 ml-16 h-screen'>
            <section className='border-r-[1px] border-r-gray-300 w-full md:w-1/4 py-8'>
                <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
                {/* <hr className='mb-4 border-gray-300' /> */}
                <div className='overflow-y-auto h-[80vh]'>
                    {
                        suggestedUsers?.map((suggestedUser) => {
                            const isOnline = onlineUsers.includes(suggestedUser._id)
                            return (
                                <div onClick={() => {
                                    dispatch(setSelectedUser(suggestedUser))
                                    dispatch(removeMessageNotification(suggestedUser?._id))
                                }
                                    } key={suggestedUser._id} className='flex gap-2 items-center p-3 hover:bg-gray-50 cursor-pointer'>
                                    <Avatar className='w-14 h-14'>
                                        <AvatarImage src={suggestedUser?.profilePicture} className='object-cover'></AvatarImage>
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>{suggestedUser?.username}</span>
                                        <span className={`text-xs ${isOnline ? 'text-green-500' : 'text-red-600'} font-bold`}>{isOnline ? "Online" : "offline"}</span>
                                    </div>
                                    {
                                        messageNotification.includes(suggestedUser._id) && 
                                        <div className='rounded-full h-3 w-3 bg-blue-600 text-xs text-center text-white ml-auto animate-pulse transition-all ease-in-out duration-1000'></div>
                                    }
                                </div>
                            )
                        })
                    }
                </div>

            </section>
            {
                selectedUser ? (
                    <section className='flex-1 flex flex-col '>
                        <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                            <Avatar>
                                <AvatarImage src={selectedUser?.profilePicture} className='object-cover'>
                                </AvatarImage>
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col '>
                                <span>{selectedUser?.username}</span>
                            </div>
                            <div className='ml-auto'>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <MoreHorizontal className='cursor-pointer ml-auto'></MoreHorizontal>
                                    </DialogTrigger>
                                    <DialogContent className='flex flex-col items-center text-center absolute top-14'>

                                        <Button variant='ghost' onClick={()=>{
                                            clearChatHandler();
                                            dispatch(setMessages([]));
                                        }} className='cursor-pointer w-fit font-bold text-red-500'>Delete Chat</Button>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <Messages selectedUser={selectedUser}></Messages>
                        <div className='flex items-center p-4 border-t-gray-300 '>
                            <Input type="text" value={textMessage} onChange={(e) => setTextMessage(e.target.value)} className='flex-1 mr-2 focus-visible:ring-transparent ' placeholder="messages..."></Input>
                            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
                        </div>
                    </section>

                ) :
                    (
                        <div className='flex ml-[26%] flex-col items-center justify-center'>
                            <MessageCircleCode className='w-36 h-36 my-4'></MessageCircleCode>
                            <h1 className='font-medium text-xl'>Your Messages</h1>
                            <span>Send a Message to start chat</span>
                        </div>
                    )
            }
        </div>
    )
}

export default ChatPage