import { Dialog, DialogContent,DialogTrigger } from './ui/dialog'
import React, { useEffect, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Comment from './Comment'
import { setPost } from '@/redux/postSlice'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'

const Commnetdialog = ({ open, setOpen }) => {
    const dispatch = useDispatch();
    
    const [text,setText] = useState('');
    const {selectedPost,posts} = useSelector((state) => state.post)
    const [comment,setComment] = useState(selectedPost?.comments);
    const changeEventHandler = (e) =>{
        const inputText = e.target.value;
        setText(inputText);
    }
    useEffect(()=>{
        if(selectedPost){
            setComment(selectedPost?.comments)
        }
    },[selectedPost]);

    const sendMessageHandler = async(req,res) =>{
        try{
            const res = await axios.post(`http://localhost:4000/api/v1/post/${selectedPost?._id}/comment`,{text},{
                withCredentials:true
            });
            if(res.data.success){
                const updatedCommentData = [...comment,res.data.comment];
                setComment(updatedCommentData);
                const updatedPostData = posts.map((p) => 
                    p._id === selectedPost?._id ? {...p,comments:updatedCommentData} : p
                );
                dispatch(setPost(updatedPostData));
                setText('')
                toast.success(res.data.message);
            }
        }catch(error){
            console.log(error);
            console.log(error.message)
        }
    }
    return (
        <Dialog className='inset-0 z-40 ' open={open}>
            
            <DialogContent onInteractOutside={() => setOpen(false)} className='max-w-5xl p-0 flex flex-col'>
                <div className='flex flex-1'>
                    <div className='w-1/2'>
                        <img className='w-full h-full rounded-l-lg object-cover' src={selectedPost?.image} alt="postimg" />
                    </div>

                    <div className='w-1/2 flex flex-col justify-between'>
                        <div className='flex items-center p-4 justify-between '>
                            <div className='flex gap-3 w-full items-center'>
                                <Link>
                                    <Avatar>
                                        <AvatarImage src={selectedPost?.author?.profilePicture}></AvatarImage>
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className='font-semibold text-xs'>
                                    {selectedPost?.author?.username}
                                    </Link>
                                    
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <MoreHorizontal className='cursor-pointer ml-auto'></MoreHorizontal>
                                    </DialogTrigger>
                                    <DialogContent className='flex flex-col items-center text-center text-sm'>
                                        <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                                            Unfollow
                                        </div>
                                        <div className='cursor-pointer w-full'>
                                            Add to Favorites
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            
                        </div>
                        <hr />
                        <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                            {
                                comment?.map((comment)=> <Comment key={comment?._id} comment={comment}></Comment>)
                            }
                        </div>
                        <div className='p-4 '>
                            <div className='flex gap-2 items-center'>
                                <input type="text" value={text} onChange={changeEventHandler} placeholder='Add a Comment..' className='w-[90%] text-sm outline-none border-gray-300 border p-2 rounded'/>
                                <button className='border border-gray-300 p-2' disabled={!text.trim()} onClick={sendMessageHandler}>Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default Commnetdialog