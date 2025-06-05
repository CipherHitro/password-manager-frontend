import { useState } from 'react'
import './App.css'
import Manager from './components/Manager'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Main from './pages/Main'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';

function App() {
  const [count, setCount] = useState(0)
  const router = createBrowserRouter([
    {
      path: '/',
      element: <><Main/></>
    },
    {
      path: '/login',
      element: <><Login/></>
    },
    {
      path: '/signup',
      element: <><Signup/></>
    },
    {
      path: '/forgot-password',
      element: <><ForgotPassword/></>
    },
    {
      path: '/verify-otp',
      element: <><VerifyOTP/></>
    },
    {
      path: '/reset-password',
      element: <><ResetPassword/></>
    },
  ])

  return (
    <>
      <RouterProvider router={router}/>
      
    </>
  )
}

export default App
