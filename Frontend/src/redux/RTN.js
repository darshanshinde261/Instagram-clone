import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name:"realTimeNotification",
    initialState:{
        likeNotification:[],
        messageNotification:[],
    },
    reducers:{
        setLikeNotification:(state,action)=>{
            if(action.payload?.type === 'like'){
                state.likeNotification = [...state.likeNotification, action.payload];
            }else if(action?.payload?.type === 'comment'){
                state.likeNotification = [...state.likeNotification,action.payload];
            }
            else{
                state.likeNotification = state.likeNotification.filter(
                    (item) => item?.userId !== action?.payload?.userId
                  );
            }
        },
        setNotificationempty:(state)=>{
            state.likeNotification = [];
        },
        setMessageNotification:(state,action)=>{
            if (!Array.isArray(state.messageNotification)) {
                state.messageNotification = [];
            }
            const userId = action?.payload?.userId;
            if (userId && !state.messageNotification.some(userid => userid === userId)) {
                // If the userId is not already in the array, add it
                state.messageNotification.push(userId);
            }
        },
        removeMessageNotification:(state,action)=>{
            state.messageNotification = state.messageNotification.filter(
                (id) => id !== action?.payload
              );
        },
    }
});

export const {setLikeNotification,setNotificationempty,setMessageNotification,setMessageNotificationEmpty,removeMessageNotification} = rtnSlice.actions;
export default rtnSlice.reducer;