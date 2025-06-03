import { useState } from 'react'
import './App.css'
import Manager from './components/Manager'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Main from './pages/Main'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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
  ])

  return (
    <>
      <RouterProvider router={router}/>
      
    </>
  )
}

export default App
