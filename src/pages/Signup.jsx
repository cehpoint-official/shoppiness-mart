import React, { useState } from 'react'
import Backimg from "../assets/backimg.png"
import ShoppingBag2 from "../assets/ShoppingBag2.png"
import Signupimg from "../assets/signupimg.png"
import Googleicon from "../assets/googleicon.png"
import Facebookicon from "../assets/facebookicon.png"
import { useRegisterMutation } from '../redux/api/AuthApi'
const Signup = () => {
    const [Register] = useRegisterMutation()
    const [userData, setUserData] = useState({
        fname: "",
        lname: "",
        phone: "",
        email: "",
        password: "",


    })
    return <>

        <div className=' overflow-hidden '>
            <div className='grid grid-cols-1 sm:grid-cols-2 '>
                <div className="">
                    <div class="absolute  ">
                        <img src={Backimg} alt="" className=" " />
                    </div>
                    <div class="relative ">
                        <div className="mx-10 mt-5">
                            <img src={ShoppingBag2} alt="" className="h-11   " />
                        </div>
                        <div className=''>
                            <img src={Signupimg} alt="" className="" />
                        </div>
                    </div>
                </div >


                {/* Right column */}
                <div className=''>
                    <div className=''>

                        <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
                            <p className='text-4xl font-semibold text-center mt-10 md:mt-12'>Signup</p>
                            <p className='text-xl text-gray-500 text-center mt-10'>Welcome!Create a new account</p>

                            <div className='mx-auto md:mx-28 mt-3'>
                                <label htmlFor='name' className='block mb-1 text-gray-600 mx-24   '>
                                    First Name
                                </label>
                                <input
                                    type='text'
                                    value={userData.firstName}
                                    onChange={e => setUserData({ ...userData, fname: e.target.value })}
                                    className='w-64 md:w-96 p-2 border m border-gray-200 bg-slate-100 rounded mx-24'
                                />
                            </div>
                            <div className='mx-auto md:mx-28'>
                                <label htmlFor='name' className='block mb-1 text-gray-600 mx-24'>
                                    Last Name
                                </label>
                                <input
                                    type='text'
                                    value={userData.lastName}
                                    onChange={e => setUserData({ ...userData, lname: e.target.value })}
                                    className='w-64 md:w-96 p-2 border border-gray-200 bg-slate-100 rounded mx-24'
                                />
                            </div>
                            <div className='mx-auto md:mx-28'>
                                <label htmlFor='number' className='block mb-1 text-gray-600 mx-24'>
                                    Phone Number
                                </label>
                                <input
                                    type='number'
                                    value={userData.phone}
                                    onChange={e => setUserData({ ...userData, phone: e.target.value })}
                                    className='w-64 md:w-96 p-2 border border-gray-200 bg-slate-100 rounded mx-24'
                                />
                            </div>
                            <div className='mx-auto md:mx-28'>
                                <label htmlFor='email' className='block mb-1 text-gray-600 mx-24'>
                                    Email Address
                                </label>
                                <input
                                    type='email'
                                    value={userData.email}
                                    onChange={e => setUserData({ ...userData, email: e.target.value })}
                                    className='w-64 md:w-96 p-2 border border-gray-200 bg-slate-100 rounded mx-24'
                                />
                            </div>
                            <div className='mx-auto md:mx-28'>
                                <label htmlFor='password' className='block mb-1 text-gray-600 mx-24'>
                                    Password
                                </label>
                                <input
                                    type='password'
                                    value={userData.password}
                                    onChange={e => setUserData({ ...userData, password: e.target.value })}
                                    className='w-64 md:w-96 p-2 border border-gray-200 bg-slate-100 rounded mx-24'
                                />
                            </div>
                            <div>
                                <div className=" text-center  mt-2">
                                    <input className="form-check-input h-4 w-5" type="checkbox" />
                                    <label className="form-check-label  text-gray-500 " for="id">
                                        I agree with terms conditions and privacy policy
                                    </label>
                                </div>
                            </div>

                            <button onClick={e => Register(userData)} className='bg-[#049D8E] text-white mx-28  md:mx-52 w-64 md:w-96 px-4 py-2 rounded mt-14 md:mt-6'>
                                Create account
                            </button>
                            <div className='text-gray-500 text-center mt-5'>or</div>
                        </div>


                        <div className='mt-5 md:flex md:justify-center'>
                            <div className='mx-44 md:mx-0 md:mr-5 '>
                                <img src={Googleicon} alt="" className='border-2 px-8 py-2 rounded-md  md:w-1/2 lg:w-auto' />
                            </div>


                            <div className='mx-44 md:mx-0 mt-5 md:mt-0 '>
                                <img src={Facebookicon} alt="" className='border-2 px-8 py-2 rounded-md md:w-1/2 lg:w-auto' />
                            </div>
                        </div>
                        <div className='mt-7 text-center'>
                            <p className='font-medium text-lg'>Already have an account? <a href="/login" className=' text-[#049D8E] font-medium underline'>Login</a></p>
                        </div>
                    </div>




                </div>
            </div>

        </div>
    </>
}

export default Signup