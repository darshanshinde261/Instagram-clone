import React, { useEffect } from 'react'
import Signup from './components/Signup'
import Login from './components/Login'
import Home from './components/Home'
import MainLayout from './components/MainLayout'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/RTN'
import { setMessageNotification } from './redux/RTN'
import ProtectedRoute from './components/ProtectedRoute'


const browserRouter = createBrowserRouter([
  {
    path:"/",
    element:<ProtectedRoute><MainLayout/></ProtectedRoute>,
    children:[
      {
        path:'/',
        element:<ProtectedRoute><Home/></ProtectedRoute>
      },
      {
        path:'/profile/:id',
        element:<ProtectedRoute><Profile/></ProtectedRoute>
      },
      {
        path:"/account/edit",
        element:<ProtectedRoute><EditProfile></EditProfile></ProtectedRoute>
      },
      {
        path:"/chat",
        element:<ProtectedRoute><ChatPage/></ProtectedRoute>
      }
    ]
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/signup",
    element:<Signup/>
  }
])
const App = () => {
  const {socket} = useSelector((state) => state.socketio)
  const dispatch = useDispatch();
  const {user} = useSelector((state)=>state.auth)
  useEffect(()=>{
    if(user){
      const socketio = io("http://localhost:4000",{
        query:{
          userId:user?._id
        },
        transports:['websocket'],
        withCredentials: true,
      });
      dispatch(setSocket(socketio))
      //listening all events
      socketio.on('getOnlineUsers',(onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers))
      });
      socketio.on('notification',(notification)=>{
        dispatch(setLikeNotification(notification))
      })
      socketio.on('arrive',(notification)=>{
        dispatch(setMessageNotification(notification))
      })
      return () =>{
        socketio.close();
        dispatch(setSocket(null))
      }
    }else if(socket){
        socket.close();
        dispatch(setSocket(null));
    }
},[user,dispatch])

  return (
    <div>
      <RouterProvider router={browserRouter}/>
    </div>
  )
}

export default App