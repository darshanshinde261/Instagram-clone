import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPost } from "@/redux/postSlice";

const useGetAllPost = () =>{
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllPost = async() =>{
            try{
                const res = await axios.get("https://instagram-clone-gi9m.onrender.com/api/v1/post/all",{withCredentials:true});
                if(res.data.success){
                    dispatch(setPost(res.data.posts));
                }
            }catch(error){
                console.log(error);
            }
        }
        fetchAllPost();
    },[]);
}

export default useGetAllPost