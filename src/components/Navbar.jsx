import React, { useState, useEffect } from 'react'
import { Linkedin, BadgePlus, LogIn, UserPlus, UserRoundPlus, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import { Bounce, ToastContainer, toast } from 'react-toastify';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  useEffect(() => {
    const token = Cookies.get('uid');
    setIsAuthenticated(!!token);  // true if token exists, false otherwise


  }, []);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('uid');
    setIsAuthenticated(false);
    navigate('/login'); // redirect to login page
    setTimeout(() => {
      toast.success('Logged out!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce
      });
    }, 200);
  };


  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <nav className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 shadow-lg flex justify-around items-center px-6 py-2 text-white font-sans">
        <NavLink to={'/'}><div className="text-2xl font-extrabold tracking-wide cursor-pointer text-center text-white hover:scale-105 transition-transform duration-300">
          <span className="text-blue-400">&lt;</span>
          Pass<span className="text-pink-500">Man</span>
          <span className="text-blue-400">/&gt;</span>
          <div className="text-xs text-gray-300 mt-[-4px]">Your secure password vault</div>
        </div></NavLink>


        {isAuthenticated ?
          <div className="buttons flex gap-3">

            <a href="https://www.linkedin.com/in/rohit-rathod-012002286/" target='_blank'><button className='flex border border-white p-2 rounded-full px-4 gap-1 text-md cursor-pointer hover:bg-slate-500 hover:font-semibold'>
              <Linkedin strokeWidth={0.75} />
              <span className="hidden md:inline">Linkedin</span>
            </button></a>

            <button onClick={handleLogout} className='flex border border-white p-2 rounded-full px-4 gap-1 text-md cursor-pointer hover:bg-slate-500 hover:font-semibold'>
              <LogOut />
              <span className="hidden md:inline">Logout</span>
            </button>


          </div> : <div className="buttons flex gap-3">


            <NavLink to="/Login"> <button className='flex border border-white p-2 rounded-full px-4 gap-1 text-md cursor-pointer hover:bg-slate-500 hover:font-semibold'>
              <LogIn />
              <span className="hidden md:inline">Login</span>
            </button>
            </NavLink>

            <NavLink to="/Signup"><button className='flex border border-white p-2 rounded-full px-4 gap-1 text-md cursor-pointer hover:bg-slate-500 hover:font-semibold'>
              <UserRoundPlus />
              <span className="hidden md:inline">SignUp</span>
            </button></NavLink>
          </div>

        }
      </nav>
    </>
  )
}

export default Navbar
