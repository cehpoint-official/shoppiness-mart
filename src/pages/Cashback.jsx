import React from 'react'
import Cashbackimg1 from "../assets/Cashbackimg1.png"
import Cashbackimg2 from "../assets/Cashbackimg2.png"
import Cashbackimg3 from "../assets/Cashbackimg3.png"
import ShoppingBag from "../assets/ShoppingBag.png"
import Backimg13 from "../assets/backimg13.png"

const Cashback = () => {
  return <>
  {/*  */}
  {/* 1st page */}
  <div className='my-28  '>
            <div className="grid grid-cols-12 mx-4 md:mx-16 px-4 md:px-10">
                <div className="col-span-12 md:col-span-6">
                    <p className="text-2xl md:text-4xl font-semibold mt-16 md:mt-12">What is Cash back Charity</p>
                    <p className="text-base md:text-xl text-gray-500 mt-7">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem recusandae impedit totam aperiam nesciunt doloremque magni neque placeat, laborum nisi eum quae voluptatum </p>
                    <p className="text-base md:text-xl text-gray-500 ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem recusandae impedit totam aperiam nesciunt doloremque magni neque placeat, laborum nisi eum quae voluptatum </p>
<button type="button" class="bg-[#049D8E] rounded-md py-2 px-4 text-white  mt-5">Sign up for free</button>

                </div>
                <div className="col-span-12 md:col-span-6">
                    <div className="flex flex-wrap justify-center md:justify-start">
                     <img src={Cashbackimg1 } alt="" />
                        
                    </div>

                    
                </div>
            </div>
  </div>
  {/* 2nd page */}
  <div className='bg-[#EDF6FB] pt-10 pb-10 '>
            <div className="grid grid-cols-12 mx-4 md:mx-16 px-4 md:px-10">
            <div className="col-span-12 md:col-span-6">
                    <div className="flex flex-wrap justify-center md:justify-start">
                     <img src={Cashbackimg2} alt="" />
                        </div>
                        </div>
                <div className="col-span-12 md:col-span-6 mx-7 ">
                    <p className="text-2xl md:text-4xl font-semibold mt-16 md:mt-12">How cash back charity Works</p>
                    <p className="text-base md:text-xl text-gray-500 mt-7">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem recusandae impedit totam aperiam nesciunt doloremque magni neque placeat, laborum nisi eum quae voluptatum </p>
                    <p className="text-base md:text-xl text-gray-500 ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem recusandae impedit totam aperiam nesciunt doloremque magni neque placeat, laborum nisi eum quae voluptatum </p>
                    <button type="button" class="bg-[#049D8E] rounded-md py-2 px-4 text-white  mt-5">Start Shopping</button>

                </div>
               
            </div>
  </div>
  {/* 3rd page */}
  <div className='my-28  '>
            <div className="grid grid-cols-12 mx-4 md:mx-16 px-4 md:px-10">
                <div className="col-span-12 md:col-span-6">
                    <p className="text-2xl md:text-4xl font-semibold mt-16 md:mt-12">Help from Cash back charity</p>
                    <p className="text-base md:text-xl text-gray-500 mt-7">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem recusandae impedit totam aperiam nesciunt doloremque magni neque placeat, laborum nisi eum quae voluptatum </p>
                    <p className="text-base md:text-xl text-gray-500 ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem recusandae impedit totam aperiam nesciunt doloremque magni neque placeat, laborum nisi eum quae voluptatum </p>
<button type="button" class="bg-[#049D8E] rounded-md py-2 px-4 text-white  mt-5">Sign up for free</button>

                </div>
                <div className="col-span-12 md:col-span-6">
                    <div className="flex flex-wrap justify-center md:justify-start">
                     <img src={Cashbackimg3} alt="" />
                        </div>
                   </div>
              </div>
  </div>
  {/* footer */}
  <div className=" mx-auto bg-[#049D8E] py-20 z-10  mt-5 overflow-hidden lg:justify-center items-center ">
            <div className=' w-44 hidden md:block lg:block'></div>

            <div class="mx-4 flex flex-wrap lg:justify-center items-center ">
                <div class="w-full   px-8 sm:w-2/3 lg:w-3/12">

                    <div className=" mb-10 mt-3 w-full">
                        <a href="" class="mb-6 inline-block w-full">
                            <img src={ShoppingBag} alt="" className='' />
                        </a>
                        <p className="mb-7 text-lg text-white">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem
                        </p>
                        <p className="flex items-center text-lg  text-white">
                            <span class="mr-3 text-[#FFD705]">
                                Call Us
                            </span>
                            <span> +91 6368900045</span>
                        </p>
                        <p className="flex items-center text-lg mt-4  text-white">
                            <span class="mr-3 text-[#FFD705]">
                                Email Us
                            </span>
                            <span> email@gmail.com</span>
                        </p>
                    </div>
                </div>
                <div className="w-full  px-8 sm:w-1/2 lg:w-2/12">
                    <div className="mb-10 w-full mt-7">
                        <h4 className="mb-9 text-3xl font-semibold text-white">Latest Posts</h4>
                        <ul>
                            <li>
                                <a href="" className="mb-2 inline-block text-xl  text-white ">
                                    New post 1
                                </a>
                                <p className='text-[#FFD705]'>12 feb,2024</p>
                            </li>
                            <li>
                                <a href="" className="mb-2 inline-block text-xl mt-2  text-white ">
                                    New post 2
                                </a>
                                <p className='text-[#FFD705] mt-1'>12 feb,2024</p>
                            </li>
                            <li>
                                <a href="" className="mb-2 inline-block text-xl mt-2 text-white ">
                                    New post 3
                                </a>
                                <p className='text-[#FFD705]'>12 feb,2024</p>
                            </li>

                        </ul>
                    </div>
                </div>
                <div className="w-full px-8 sm:w-1/2 lg:w-2/12">
                    <div className="mb-10 w-full mt-7">
                        <h4 className="mb-9 text-3xl font-semibold text-white">Links</h4>
                        <ul>
                            <li>
                                <a href="" className="mb-2 inline-block text-xl font-medium text-white ">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="" className="mb-2 inline-block text-xl mt-2 font-medium  text-white ">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="" className="mb-2 inline-block text-xl font-medium mt-2  text-white ">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a href="" className="mb-2 inline-block text-xl font-medium mt-2   text-white ">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="" className="mb-2 inline-block text-xl font-medium mt-2  text-white ">
                                    Blogs
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="w-full px-8  sm:w-1/2 lg:w-1/3 ">
                    <div class="mb- w-full ">
                        <img src={Backimg13} alt="" className='' />
                    </div>
                </div>

            </div>
        </div>
        {/* link */}
        <div className="bg-[#EDF6FB] mt-3 w-full px-3 lg:justify-between  md:flex-row">
            <div className='flex justify-between '>
                <p class="text-[#048376]">© 2024 UX/UI Team</p>
                <div class="text-[#048376] ">
                    <i class="bi bi-instagram"></i>
                    <i class="bi bi-twitter ml-2"></i>
                    <i class="bi bi-facebook ml-2"></i>
                </div>
                <div className=''>
                    <p className="text-[#048376]">All Rights Reserved</p>
                </div>
            </div>
        </div>
  </>
}

export default Cashback