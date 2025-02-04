import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent,DialogHeader } from './ui/dialog'
import { Textarea } from './ui/textarea'
import { readFileAsDataURL } from '@/lib/utils'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import {setPost} from "../redux/postSlice"

const CreatePost = ({open,setOpen}) => {
    const dispatch = useDispatch()
    const imageRef= useRef();
    const [file,setFile] = useState('');
    const {posts} = useSelector((state) => state.post)
    const [loading,setLoading] = useState(false);
    const [caption,setCaption] = useState('');
    const [imagePreview,setImagePreview] = useState('');
    const {user} = useSelector((state) => state.auth)
    const fileChangeHandler=async(e)=>{
        const file = e.target.files?.[0];
        if(file){
            setFile(file);
            const dataurl = await readFileAsDataURL(file);
            setImagePreview(dataurl);
        }
    }

    const createPostHandler = async(e) =>{
        const formdata = new FormData();
        formdata.append("caption",caption);
        if(imagePreview){
            formdata.append("image",file);
        }
        
        try{
            setLoading(true);
            const res = await axios.post('http://localhost:4000/api/v1/post/addpost',formdata,{
                headers: {
                    "Content-Type": 'multipart/form-data',
                },
                withCredentials:true,
            });
            
            if(res.data.success){
                dispatch(setPost([res.data?.post,...posts]))
                toast.success(res.data?.message);
                setOpen(false);
            }
        }catch(error){
            toast.error(error.response?.data?.message);
            console.log(error);
        }
        finally{
            setLoading(false);
        }
    }
  return (
    <div>
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} >
                <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
                <div className='flex gap-3 items-center '>
                    <Avatar>
                        <AvatarImage src={user?.profilePicture} alt='img'></AvatarImage>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className='font-semibold text-xs'>{user?.username}</h1>
                        <span className='text-gray-600'>Bio Here...</span>
                    </div>
                    
                </div>
                <Textarea value={caption} onChange={(e)=>setCaption(e.target.value)} className='focus-visible:ring-transparent border-none' placeholder='write a caption'></Textarea>
                {
                    imagePreview && 
                    <div className='w-full h-64 flex items-center justify-center'>
                        <img src={imagePreview} alt="preview_img" className='object-cover w-full h-full rounded-md'/>
                    </div>
                    
                }
                <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler} />
                <button onClick={()=>imageRef.current.click()} className='w-fit mx-auto rounded-sm text-white font-semibold py-2 px-3 text-sm  hover:bg-opacity-90 transition-all duration-200 bg-blue-600 '>Select From Computer</button>
                {
                    imagePreview && 
                    (
                        loading ? ( 
                            <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please Wait...
                            </Button>):
                        (<Button type='submit' onClick={createPostHandler} className='w-full'>Post</Button>)

                    )
                }
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default CreatePost