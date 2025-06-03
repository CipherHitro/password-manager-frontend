import React, { useState, useRef, useEffect } from 'react'
import { ExternalLink, Clipboard } from 'lucide-react';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Manager = () => {
    const navigate = useNavigate()
    const passRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);
    const [passwords, setPasswords] = useState([])
    const [form, setForm] = useState({ site: "", username: "", password: "" })
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:2000";

    const fetchPasswords = async () => {
        try {
            console.log('Cookies being sent:', document.cookie);
            const response = await fetch(`${API_BASE_URL}/password`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (response.status === 401) {
                setPasswords([])
                return;
            }
            const pass = await response.json()
            if (pass) {
                setPasswords(pass)
            }
            else {
                setPasswords([])
            }
        } catch (error) {
            console.error("Error:", error);
        }


        console.log("passwords : ", passwords)
    }
    useEffect(() => {
        fetchPasswords();
    }, [])


    const togglePassword = () => {
        setShowPassword((prev) => !prev);
        passRef.current.type = showPassword ? "password" : "text";
    };

    // const toastOptions = {
    //     position: "top-right",
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "dark",
    //     transition: Bounce
    // }

    const savePassword = async () => {

        try {
            const response = await fetch(`${API_BASE_URL}/password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // to send cookies
                body: JSON.stringify(form)
            });
            console.log("response : ", response)
            if (response.status === 401) {
                navigate('/login');
                setTimeout(() => {
                    toast.error('Please log in to save password',);
                }, 300);

            }
            const result = await response.json();
            console.log(result);
            if (response.status == 201) {

                toast.success('Password Saved!');
            }
            else {
                toast.success('Password Edited!');
            }

            setForm({ site: "", username: "", password: "" });
            fetchPasswords();

        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong!");
        }
    }
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })

    }

    const handleDelete = async (id) => {
        if (confirm("Do you want to delete the password?")) {
            const response = await fetch(`${API_BASE_URL}/password/${id}`, {
                method: "DELETE",
                credentials: "include",
            })
            const result = await response.json()
            console.log(result);
            toast.error('Deleted successfully!');
            fetchPasswords();
        }
    }
    const handleEdit = (id) => {
        console.log(id)

        setForm(passwords.filter(e => e._id === id)[0])
        let newPasswords = passwords.filter((e) => { return e._id != id });
        console.log(newPasswords)

        setPasswords(newPasswords)

        // localStorage.setItem('passwords', JSON.stringify(passwords))
    }

    const handleCopy = (item) => {
        toast('Coppied to clipboard!');
        navigator.clipboard.writeText(item)

    }
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

            {/* <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[size:6rem_4rem]"></div> */}
            <div className="container bg-blue-30 rounded-xl mx-auto max-w-5xl m-4 p-3 sm:p-4 md:p-6">
                <div className="text-black flex flex-col">
                    <div className="text-center py-2">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-wide">
                            <span className="text-blue-500">&lt;</span>
                            Pass<span className="text-pink-500">Man</span>
                            <span className="text-blue-500">/&gt;</span>
                        </h1>
                        <p className="text-sm text-center md:text-base text-slate-500 my-2 font-medium">
                            Your Own Password Manager
                        </p>
                    </div>
                    <input required value={form.site} name='site' onChange={handleChange} type="text" placeholder='Enter Website URL' className='rounded-full border border-blue-300 py-1 mx-6 px-4' />
                    <div className='flex gap-3 mx-6 mt-7 mb-4'>

                        <input required value={form.username} name='username' onChange={handleChange} type="text" placeholder='Enter Username' className='rounded-full border border-blue-300 w-full px-4 py-1 text-sm sm:text-base placeholder:text-sm sm:placeholder:text-base' />
                        <div className="relative w-full md:w-1/2">
                            <input required value={form.password} name='password' onChange={handleChange}
                                ref={passRef}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Password"
                                className="rounded-full border border-blue-300 w-full px-4 py-1 pr-10 text-sm sm:text-base placeholder:text-sm sm:placeholder:text-ba"
                            />
                            <span className="absolute md:right-4 right-2 top-1/2 transform -translate-y-1/2 cursor-pointer">
                                <img src={showPassword ? "openEye.png" : "closeEye.png"} alt="closeeye" className="w-5 h-5" onClick={togglePassword} />
                            </span>
                        </div>
                    </div>
                    <div className="icon flex justify-center gap-3 mx-4">

                        <button disabled={form.username <= 2 || form.site <= 2 || form.password <= 2} onClick={() => { savePassword() }} className='bg-blue-300 disabled:bg-slate-300 hover:bg-blue-400  border border-black my-4 cursor-pointer flex text-center justify-center gap-2 px-5 py-2 rounded-full'><lord-icon
                            src="https://cdn.lordicon.com/efxgwrkc.json"
                            trigger="hover"
                            style={{ "width": "28px", "height": "28px" }}>
                        </lord-icon> <span className='justify-center text-center text-lg font-semibold'>Save</span></button>

                    </div>

                    <div className="flex flex-col mx-6 ">
                        <h2 className='text-xl font-bold mb-3 ml-1 text-center md:text-left '>Your Saved Passwords</h2>

                        <div className="-m-1.5 overflow-x-auto">
                            <div className="p-1.5 min-w-full inline-block align-middle">
                                {passwords.length === 0 && (
                                    <h2 className="text-center text-xl font-semibold my-8">
                                        No saved passwords
                                    </h2>
                                )}
                                {passwords.length !== 0 && (
                                    <div className="border border-gray-200 rounded-lg shadow-xs">
                                        <table className="min-w-[600px] w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="py-3 text-center text-xs font-bold text-gray-500 uppercase w-[30%]">
                                                        Website
                                                    </th>
                                                    <th className="py-3 text-center text-xs font-bold text-gray-500 uppercase w-[25%]">
                                                        Username
                                                    </th>
                                                    <th className="py-3 text-center text-xs font-bold text-gray-500 uppercase w-[25%]">
                                                        Password
                                                    </th>
                                                    <th className="py-3 text-center text-xs font-bold text-gray-500 uppercase w-[20%]">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                        </table>

                                        <div className="md:max-h-[220px] max-h-[220px] overflow-y-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <tbody className="divide-y divide-gray-200">
                                                    {passwords.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="text-center py-4 text-sm font-medium text-gray-800 w-[30%]">
                                                                <div className="flex justify-center gap-3">
                                                                    <h2 className="truncate md:max-w-[160px] max-w-[120px]">{item.site}</h2>
                                                                    <a
                                                                        href={item.site.startsWith("http") ? item.site : `https://${item.site}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        <ExternalLink
                                                                            className="cursor-pointer opacity-80 hover:opacity-100"
                                                                            width={20}
                                                                            height={20}
                                                                        />
                                                                    </a>
                                                                </div>
                                                            </td>
                                                            <td className="text-center py-4 text-sm text-gray-800 w-[25%]">
                                                                <div className="flex justify-center gap-3">
                                                                    <h2>{item.username}</h2>
                                                                    <Clipboard
                                                                        onClick={() => handleCopy(item.username)}
                                                                        className="cursor-pointer opacity-80 hover:opacity-100"
                                                                        width={20}
                                                                        height={20}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="text-center py-4 text-sm text-gray-800 w-[25%]">
                                                                <div className="flex justify-center gap-3">
                                                                    <h2>{item.password}</h2>
                                                                    <Clipboard
                                                                        onClick={() => handleCopy(item.password)}
                                                                        className="cursor-pointer opacity-80 hover:opacity-100"
                                                                        width={20}
                                                                        height={20}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="text-center py-4 text-sm font-medium w-[20%]">
                                                                <div className="icons flex justify-center px-3 gap-4 cursor-pointer">
                                                                    <lord-icon
                                                                        src="https://cdn.lordicon.com/ibckyoan.json"
                                                                        trigger="hover"
                                                                        style={{ width: "25px", height: "25px" }}
                                                                        onClick={() => handleEdit(item._id)}
                                                                    ></lord-icon>

                                                                    <lord-icon
                                                                        src="https://cdn.lordicon.com/xyfswyxf.json"
                                                                        trigger="hover"
                                                                        style={{ width: "25px", height: "25px" }}
                                                                        onClick={() => handleDelete(item._id)}
                                                                    ></lord-icon>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Manager

