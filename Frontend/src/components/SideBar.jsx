import { TrendingUp, Home, Search, MessageCircle, Heart, PlusSquare, LogOut } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import CreatePost from './CreatePost'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import { setPost, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'
import { Button } from './ui/button'
import { setNotificationempty } from '@/redux/RTN'

const SideBar = () => {
    const dispatch = useDispatch();
    const [popoverOpen, setPopoverOpen] = useState(false);
    const { likeNotification } = useSelector((state) => state.realTimeNotification)
    const [open, setOpen] = useState(false);
    const { user } = useSelector((state) => state.auth)
    const navigate = useNavigate();
    const {messageNotification} = useSelector((state)=>state.realTimeNotification)

    const handlePopoverClose = () => {
        dispatch(setNotificationempty())
    };
    const sidebarItems = [
        {
            item: <Home />, text: "Home"
        },
        {
            item: <Search />, text: "Search"
        },
        {
            item: <TrendingUp />, text: "Explore"
        },
        {
            item: <MessageCircle />, text: "Messages"
        },
        {
            item: <Heart />, text: "like"
        },
        {
            item: <PlusSquare />, text: "Create"
        },
        {
            item: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage src={user?.profilePicture} className='object-cover' />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ), text: "Profile"
        },
        {
            item: <LogOut />, text: "Logout"
        },
    ]
    const logoutHandler = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/v1/user/logout", { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPost([]))
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error)
            // toast
        }
    }
    const SideBarHandler = (textType) => {
        if (textType === "Logout") {
            logoutHandler();
        }
        else if (textType === "Create") {
            setOpen(true);
        }
        else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`)
        }
        else if (textType === "Home") {
            navigate("/");
        }
        else if (textType === "Messages") {
            
            navigate("/chat")
        }
    }
    return (
        <div className='fixed z-10 pl-2 left-0 top-0 border-r border-gray-300  lg:w-[14%] w-[8%] overflow-hidden h-screen'>
            <div className='flex flex-col'>
                <div className='flex items-center'>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxBzH8UEnwhZ3xdq-cC4D9_dK4nu_Cjk9p-Q&s" loading='lazy' className='w-12 h-12 my-4 ' alt="logo" />
                    <h1 className='font-semibold text-2xl lg:block hidden'><i>Instagram</i></h1>
                </div>

                {
                    sidebarItems.map((item, i) => (
                        <div onClick={() => SideBarHandler(item.text)} key={i} className=' flex gap-3 my-3 items-center flex-shrink-0 overflow-hidden  border-gray-200 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3'>
                            {item.item}
                            <span className='lg:block hidden'>{item.text}</span>
                            {
                                item.text === 'like' && likeNotification?.length > 0 && (
                                    <Popover open={popoverOpen} onOpenChange={(isOpen) => {
                                        setPopoverOpen(isOpen);
                                        if (!isOpen) {
                                            handlePopoverClose();  // Call the function when the popover is closed (either by clicking outside or manually)
                                        }
                                    }}>
                                        <PopoverTrigger asChild>
                                            <Button size='icon' className='rounded-full h-5 w-5 bg-red-600 transition-all duration-200 hover:bg-red-700 absolute bottom-6 left-6' >
                                                {likeNotification?.length}
                                            </Button>

                                        </PopoverTrigger>
                                        <PopoverContent onClose={handlePopoverClose}>
                                            <div>
                                                {
                                                    likeNotification.length === 0 ? (<p>No new Notification</p>) : (
                                                        likeNotification.map((notification) => {
                                                            return (
                                                                <div key={notification?.userId} className='flex items-center gap-2 my-2'>
                                                                    <Avatar>
                                                                        <AvatarImage src={notification?.userDetails?.profilePicture} className='object-cover'></AvatarImage>
                                                                        <AvatarFallback>CN</AvatarFallback>
                                                                    </Avatar>
                                                                    <p className='text-sm'><span className='font-bold '>{notification?.userDetails?.username} </span>{notification?.text}</p>
                                                                </div>
                                                            )
                                                        })
                                                    )
                                                }
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )
                            }
                            {
                                item.text === 'Messages' && messageNotification?.length > 0 && (
                                    <div className='rounded-full h-5 w-5 bg-red-600 transition-all duration-200 hover:bg-red-700 text-xs text-center text-white absolute bottom-6 left-6' >
                                                {messageNotification?.length}
                                    </div>
                                )
                            }
                        </div>
                    ))
                }
            </div>
            <CreatePost open={open} setOpen={setOpen}></CreatePost>
        </div>
    )
}

export default SideBar