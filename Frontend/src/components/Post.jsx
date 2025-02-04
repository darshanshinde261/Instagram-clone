import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogTrigger, DialogContent } from './ui/dialog'
import { Link } from 'react-router-dom';
import { MessageCircle, Send } from 'lucide-react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Commnetdialog from './Commnetdialog';
import { Button } from './ui/button';
import { toast } from 'react-toastify';
import { MoreHorizontal, Bookmark } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setPost, setSelectedPost } from '@/redux/postSlice';
import axios from 'axios';
import { Badge } from './ui/badge';

const Post = ({ post }) => {
    const { user } = useSelector((state) => state.auth)
    const [like, setLike] = useState(post?.likes?.includes?.(user?._id) || false)
    const [text, setText] = useState("")
    const { posts } = useSelector((state) => state.post)
    const [open, setOpen] = useState(false)
    const [comment, setComment] = useState(post?.comments)
    const dispatch = useDispatch()
    const [postLike, setPostLike] = useState(post?.likes?.length)


    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        inputText.trim();
        setText(inputText);
    }
    const deletePostHandler = async (req, res) => {
        try {
            const res = await axios.delete(`https://instagram-clone-gi9m.onrender.com/api/v1/post/delete/${post?._id}`, { withCredentials: true });

            if (res.data.success) {
                toast.success(res.data.message);
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
                dispatch(setPost(updatedPostData))
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.data?.message)
        }
    }
    const likeOrDislikeHandler = async () => {
        try {
            const action = like ? "dislike" : "like";
            const res = await axios.post(`https://instagram-clone-gi9m.onrender.com/api/v1/post/${post._id}/${action}`, null, {
                withCredentials: true
            });
            if (res.data.success) {
                const updatedLikes = like ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLike(!like);
                const updatedPostData = posts.map((p) =>
                    p._id === post._id ? {
                        ...p,
                        likes: like ? p.likes.filter(id => id !== user._id):[...p.likes, user._id]
                    } : p
                )
                dispatch(updatedPostData);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            console.log(error.message)
            toast.error(error);
        }
    }

    const commentHandler = async (req, res) => {
        try {
            const res = await axios.post(`https://instagram-clone-gi9m.onrender.com/api/v1/post/${post._id}/comment`, { text }, {
                withCredentials: true
            });
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);
                const updatedPostData = posts.map((p) =>
                    p._id === post._id ? { ...p, comments: updatedCommentData } : p
                );
                dispatch(setPost(updatedPostData));
                setText('')
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const bookMarkHandler = async() =>{
        try{
            const res = await axios.get(`https://instagram-clone-gi9m.onrender.com/api/v1/post/${post?._id}/bookmark`,{withCredentials:true});
            
            if(res.data.success){
                toast.success(res?.data?.message);
            }
        }catch(error){

        }
    }
    return (
        <div className='my-8 w-full max-w-sm bg-red mx-auto'>
            <div className='flex items-center gap-3'>
                <div className='flex items-center gap-2'>
                    <Link to={`/profile/${post?.author?._id}`}>
                        <Avatar>
                            <AvatarImage src={post?.author?.profilePicture} alt='post_img' className='object-cover'></AvatarImage>
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </Link>
                    <Link to={`/profile/${post?.author?._id}`}>
                    <div className='flex items-center gap-2'>
                        <h1>{post?.author?.username}</h1>
                        {user?._id === post?.author?._id && <Badge variant="secondary">Author</Badge>}
                    </div>
                    </Link>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer ml-auto'></MoreHorizontal>
                    </DialogTrigger>
                    <DialogContent className='flex flex-col items-center text-center '>
                        {
                            post?.author?._id !== user?._id &&
                            <Button variant='ghost' className='cursor-pointer w-fit font-bold text-red-500'>Unfollow</Button>
                        }
                        
                        <Button variant='ghost' className='cursor-pointer w-fit'>Add to Favourite</Button>
                        {
                            user && user?._id === post?.author?._id &&
                            <Button variant='ghost' onClick={deletePostHandler} className='cursor-pointer w-fit'>Delete</Button>
                        }
                    </DialogContent>
                </Dialog>
            </div>
            <img className='rounded-sm my-2 w-full aspect-square object-cover' loading='lazy' alt="postimg" src={post?.image} />
            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-3'>
                    {
                        like ? <FaHeart size={'24'} onClick={() => likeOrDislikeHandler()} className='cursor-pointer text-red-600'></FaHeart> :
                            <FaRegHeart onClick={() => likeOrDislikeHandler()} size={'22px'} className='cursor-pointer hover:text-gray-600'></FaRegHeart>
                    }

                    <MessageCircle onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true)
                    }} className='cursor-pointer hover:text-gray-600'></MessageCircle>
                    <Send className='cursor-pointer hover:text-gray-600'></Send>
                </div>
                <Bookmark onClick={bookMarkHandler} className='cursor-pointer hover:text-gray-600'></Bookmark>
            </div>
            <span className='font-medium block mb-1'>{postLike} likes</span>
            <p className='flex items-center'>
                <span className='font-medium m-1'>{post?.author?.username}</span>
                {post?.caption}
            </p>
            {
                comment.length > 0 && (
                    <span className='cursor-pointer text-gray-400' onClick={() => {
                        dispatch(setSelectedPost(post))
                        setOpen(true);
                    }}>View all {comment?.length} Comments </span>
                )
            }

            <Commnetdialog open={open} setOpen={setOpen}></Commnetdialog>
            <div className='flex items-center justify-between'>
                <input type="text"
                    placeholder='add a comment...'
                    onChange={changeEventHandler}
                    value={text}
                    className='outline-none text-sm w-full' />
                {
                    text && <span className='text-[#3BADF8] block cursor-pointer' onClick={commentHandler}>Post</span>
                }
            </div>
        </div>
    )
}

export default Post