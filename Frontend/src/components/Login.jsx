import React, { useEffect } from 'react';
import { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import FadeLoader from "react-spinners/FadeLoader";
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../redux/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [input, setInput] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(`https://instagram-clone-gi9m.onrender.com/api/v1/user/login`, input, {
        headers: {
          'content-type': 'application/json'
        },
        withCredentials: true,
      });
      if (res?.data?.success) {
        dispatch(setAuthUser(res?.data?.User));
        navigate("/")
        toast.success(res?.data?.message);
        setInput({
          email: '',
          password: '',
        })
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.user) {
      navigate('/')
    }
      },[]);
  return (
    <div className='flex items-center w-screen h-screen justify-center'>

      <form onSubmit={handleSubmit} className='shadow-lg flex flex-col gap-5 p-6'>
        <div className='my-4'>
          <h1 className='text-center text-xl font-bold'>LOGO</h1>
          <p className='text-sm text-center'>Login to See photos and video's from your friends</p>
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
        {
          loading ? (
            <Button>
              <Loader2 className='mr-2 h-4 w-4 animate-spin'></Loader2>
              Please wait
            </Button>
          ) :
            (<Button type='submit'>LogIn</Button>
            )
        }
        <span className='text-center'>Doesn't have an account?
          <Link className='text-blue-600 font-bold cursor-pointer' to="/signup"> signup</Link></span>
      </form>
    </div>
  )
}

export default Login