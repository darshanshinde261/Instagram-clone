import React, { useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Loader } from 'lucide-react'
import FadeLoader from "react-spinners/FadeLoader";
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const Signup = () => {
  const navigate = useNavigate();
  const {user} = useSelector((state)=>state.auth)
  const [input,setInput] = useState({
    username:'',
    email:'',
    password:'',
  });

  const [loading,setLoading] = useState(false);
  const changeEventHandler = (e) =>{
    setInput({
      ...input,
      [e.target.name]:e.target.value,
    })
  };

  const handleSubmit = async(e) =>{
    e.preventDefault();

    try{
      setLoading(true);
      const res = await axios.post(`https://instagram-clone-gi9m.onrender.com/api/v1/user/register`,input,{
        headers:{
          'content-type':'application/json'
        },
        withCredentials:true,
      });
      if(res.data.success){
        navigate("/login")
        setInput({
          username:'',
          email:'',
          password:'',
        })
      }
    }catch(error){
      console.log(error.message);
      console.log(error);
      toast.error(error.response.data.message)
    }finally{
      setLoading(false);
    }
  }
  useEffect(() => {
      if (user) {
        navigate('/')
      }
    },[])
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
      {loading ? <Loader className='w-10 h-10'></Loader> :
      <form onSubmit={handleSubmit} className='shadow-lg flex flex-col gap-5 p-6'>
        <div className='my-4'>
          <h1 className='text-center text-xl font-bold'>LOGO</h1>
          <p className='text-sm text-center'>SignUp to See photos and video's from your friends</p>
        </div>
        <div>
          <Label>Username</Label>
          <Input type='text' value={input.username} onChange={changeEventHandler} name='username' className='focus-visible:ring-transparent outline-none my-2'
          ></Input>
        </div>
        <div>
          <Label>email</Label>
          <Input type='email' name='email' value={input.email} onChange={changeEventHandler} className='focus-visible:ring-transparent outline-none my-2'
          ></Input>
        </div>
        <div>
          <Label>password</Label>
          <Input type='password' name='password' value={input.password} onChange={changeEventHandler} className='focus-visible:ring-transparent outline-none my-2'
          ></Input>
        </div>
        <Button type='submit'>Signup</Button>
        <span className='text-center'>Already have an account? 
          <Link className='text-blue-600 font-bold cursor-pointer' to="/login"> Login</Link>
        </span>
      </form>}
    </div>
  )
}

export default Signup