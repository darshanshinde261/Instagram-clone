import { createSlice } from "@reduxjs/toolkit"; 

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        onlineUsers:[],
        messages:[],
        follow:false,
    },
    reducers:{
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload
        },
        setMessages:(state,action) =>{
            state.messages = action.payload
        },
        setFollow:(state,action)=>{
            state.follow = action.payload
        }
    }
});

export const {setOnlineUsers,setMessages,setFollow} = chatSlice.actions;
export default chatSlice.reducer