import React,{useState} from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import axios from 'axios';
import { useRef } from 'react';
import { Textarea } from './ui/textarea';
import { toast } from 'react-toastify';
import { Select, SelectItem, SelectValue, SelectGroup, SelectTrigger, SelectContent } from './ui/select';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setAuthUser } from '@/redux/authSlice';


const EditProfile = () => {
    const imageRef = useRef();
    const { user } = useSelector((state) => state.auth);
    const [input,setInput] = useState({
        profilePhoto:user?.profilePicture,
        bio:user?.bio,
        gender:user?.gender,
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    

    const editProfileHandler = async () => {
        const formdata = new FormData();
        formdata.append("bio",input?.bio);
        formdata.append("gender",input?.gender);
        if(input.profilePhoto){
            formdata.append("profilePicture",input?.profilePhoto)
        }
        
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:4000/api/v1/user/profile/edit",formdata,
                {hearders:{
                    'content-type':'multipart/form-data'
                },
            withCredentials:true});

            if(res.data.success){
                toast.success(res.data.message);
                console.log(res);
                const updatedUserData = {
                    ...user,
                    bio:res.data?.User?.bio,
                    profilePicture:res.data?.User?.profilePicture,
                    gender:res.data.User?.gender
                }
                dispatch(setAuthUser(updatedUserData))
                navigate(`/profile/${user?._id}`)
            }
            //const res = await axios.post();
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }
    const fileChangeHandler = (e) =>{
        const file = e.target.files[0];
        if(file){
            setInput({...input,profilePhoto:file});
        }
        
    }
    const selectChangeHandler = (value) =>{
        setInput({...input,gender:value});
    }

    return (
        <div className='flex mt-6 max-w-2xl mx-auto pl-10'>
            <section className='flex mr-8 flex-col gap-6 w-full'>
                <h1 className='font-bold text-xl'>Edit Profile</h1>
                <div>
                    <div className='flex items-center justify-between bg-green-100 rounded-xl p-4'>
                        <div className='flex items-center  gap-3'>
                            <Avatar>
                                <AvatarImage src={user?.profilePicture} alt='post_img'></AvatarImage>
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className='font-semibold text-sm'>{user?.username}</h1>
                                <span className='text-gray-600 text-sm'>{user?.bio || "bio here.."}</span>
                            </div>
                        </div>
                        <input type="file" className='hidden' onChange={fileChangeHandler} ref={imageRef} />
                        <Button onClick={() => imageRef?.current?.click()} className='bg-[#0095F6] transition-all duration-200 hover:bg-[#0173bf]'> Change Photo</Button>
                    </div>

                </div>
                <div>
                    <h1 className='font-bold text-xl mb-2'>Bio</h1>
                    <Textarea className='focus-visible:ring-transparent' onChange={(e)=>setInput({...input,bio:e.target.value})} name="bio" value={input.bio}></Textarea>
                </div>
                <div>
                    <h1 className='font-bold mb-2'></h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler} className='overflow-hidden outline-none border-none focus-visible:ring-transparent'>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex justify-end'>
                    {
                        loading ? <Button className='w-fit'>
                            <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                            please wait...</Button> :
                            <Button onClick={editProfileHandler} className='w-fit'>Submit</Button>
                    }

                </div>
            </section>
        </div>
    )
}

export default EditProfile