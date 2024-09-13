import { Link } from "react-router-dom";
import React from 'react';
import Navbar from "./../components/Navbar";
import Sidebar from "./../components/Sidebar";
import { useState } from "react";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './Dashboard.css';
import { colors } from "@mui/material";

export default function Admin_Dashboard(){
    const [view, setView] = useState('Monthly');  
  const totalCoupons = 25;  
  const pendingCoupons = 45;  
  const claimedCoupons = 5;  
  const total = 25;


  
    return(
        <div>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="p-6 bg-gray-100 flex-1">
            <div className="max-w-7xl mx-auto">
              <div className="">
                <div className="flex justify-between items-center mb-4 mt-5">
                  <h1 className="text-xl font-bold">Dashboard</h1>                 
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker label="Time Period" />
                    </DemoContainer>
                    </LocalizationProvider>  
                </div>
                <div className="space-y-4 ">
                    <div className="card mt-4">  
                        <div className="icon bg-orange-100">  
                         <i class="fa-solid fa-building-ngo fa-2xl " style={{color:'rgb(161 98 7)'}} ></i> 
                        </div>  
                        <div className="content">  
                            <h1 className="count">100</h1>  
                            <p className="description text-lg">Total NGOs/Causes</p>  
                        </div>  
                    </div>  
                    <div className="card">  
                        <div className="icon bg-green-100">  
                        <i className="fa-solid fa-store fa-2xl" style={{color:'rgb(22 163 74)'}}></i> 
                        </div>  
                        <div className="content">  
                            <h1 className="count">98</h1>  
                            <p className="description text-lg">Total Offline Shop</p>  
                        </div>  
                    </div>  
                    <div className="card">  
                        <div className="icon bg-red-100">  
                        <i class="fa-solid fa-store fa-2xl" style={{color:'rgb(236 72 153)'}} ></i> 
                        </div>  
                        <div className="content">  
                            <h1 className="count">02</h1>  
                            <p className="description text-lg">Total Online Shop</p>  
                        </div>  
                    </div>  
                    <div className="card">  
                        <div className="icon bg-violet-100">  
                        <i class="fa-solid fa-hand-holding-dollar fa-2xl" style={{color:'rgb(147 51 234)'}}></i> 
                        </div>  
                        <div className="content">  
                            <h1 className="count">60</h1>  
                            <p className="description text-lg">Total Cashback Requests</p>  
                        </div>  
                    </div>  
                    <div className="card">  
                        <div className="icon bg-blue-100"> 
                         <i class="fa-solid fa-ticket fa-2xl" style={{color:'rgb(79 70 229)'}}></i>
                        </div>  
                        <div className="content">  
                            <h1 className="count">100</h1>  
                            <p className="description text-lg">Generated Coupons</p>  
                        </div>  
                    </div>
                </div>
                <div className="dashboard mt-7">  
                    <h2 className="text-2xl font-semibold">Generated Coupons</h2>  
                    <div className="view-buttons">  
                        {['Monthly', 'Weekly', 'Today'].map((item) => (  
                        <button  
                            key={item}  
                            className={view === item ? 'active' : ''}  
                            onClick={() => handleViewChange(item)}
                        >  
                            {item}  
                        </button>  
                        ))}  
                    </div>  
                    <div className="coupon-card mt-10">  
                        <div className="coupon-count">25</div>  
                        <div className="coupon-title">All Coupons</div>  
                        <button className="view-all-button">View All &gt;</button>  
                    </div>  
                    <div className="flex justify-evenly mt-10">
                    <div className="total-container">  
                        <h2>Total</h2>  
                        <p className="total-value text-2xl font-semibold mt-3 ">{total}</p>  
                    </div>
                    <div className="total-container">  
                        <h2>Pending</h2>  
                        <p className="total-value text-2xl font-semibold mt-3">45</p>  
                    </div> 
                    <div className="total-container">  
                        <h2>Claimed</h2>  
                        <p className="total-value text-2xl font-semibold mt-3">05</p>  
                    </div>
                    </div>   
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
};