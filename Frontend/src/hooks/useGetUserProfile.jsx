import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  setUserProfile } from "@/redux/authSlice";

const useGetUserProfile = (userId) =>{
    const {follow} = useSelector((state)=>state.chat)
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchUserProfile = async() =>{
            try{
                const res = await axios.get(`http://localhost:4000/api/v1/user/${userId}/profile`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setUserProfile(res?.data?.User));
                }
            }catch(error){
                console.log(error);
            }
        }
        fetchUserProfile();
    },[userId,follow]);
}

export default useGetUserProfile