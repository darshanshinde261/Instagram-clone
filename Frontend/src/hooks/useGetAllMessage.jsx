import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestedUsers } from "@/redux/authSlice";
import { setMessages } from "@/redux/chatSlice";

const useGetAllMessage = () =>{
    const dispatch = useDispatch();
    const {selectedUser} = useSelector((state)=>state.auth)
    useEffect(()=>{
        const fetchAllMessages = async() =>{
            try{
                const res = await axios.get(`https://instagram-clone-gi9m.onrender.com/api/v1/message/all/${selectedUser?._id}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setMessages(res?.data?.messages));
                }
            }catch(error){
                console.log(error);
            }
        }
        fetchAllMessages();
    },[selectedUser]);
}

export default useGetAllMessage