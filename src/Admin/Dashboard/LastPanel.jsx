import React from 'react';  
import './Dashboard.css'; // Import the CSS file for styling  

export default function LastPanel(){  
  const activeShops = 200;  
  const inactiveShops = 20;  
  const totalShops = activeShops + inactiveShops;  

  const activePercentage = ((activeShops / totalShops) * 100).toFixed(0);  
  const inactivePercentage = ((inactiveShops / totalShops) * 100).toFixed(0);  

    const donations = [  
      { name: 'Priti Mondal', email: 'user@gmail.com', color: '#E91E63',spend:'1600' },  
      { name: 'Joy Pal', email: 'email@gmail.com', color: '#FFEB3B',spend:'250' },  
      { name: 'Ajay Mondal', email: 'abcd@gmail.com', color: '#2196F3',spend:'1000' },  
    ];  

  return (  
    <div className="flex justify-spaceevenly chart">
            <div className="shop-status-container">  
            <h2 className="text-2xl font-semibold">Active Shops</h2>  
            <div className="shop-status mt-10">  
                <div className="shop-item">  
                <div className="shop-label">  
                <i class="fa-solid fa-shop pr-4"></i> <span className="font-semibold text-lg">Active Shops</span>  
                </div>  
                <div className="progress-bar">  
                    <div  
                    className="progress"  
                    style={{ width: `${activePercentage}%` }}  
                    ></div>  
                </div>  
                <span>{activeShops} ({activePercentage}%)</span>  
                </div>  
                <div className="shop-item">  
                <div className="shop-label">  
                <i class="fa-solid fa-shop pr-4"></i> <span className="font-semibold text-lg">Inactive Shops</span>  
                </div>  
                <div className="progress-bar">  
                    <div  
                    className="progress"  
                    style={{ width: `${inactivePercentage}%` }}  
                    ></div>  
                </div>  
                <span>{inactiveShops} ({inactivePercentage}%)</span>  
                </div>  
            </div>  
        </div>
        <div className="top-donations ml-3">  
        <h2 className="text-2xl font-semibold ml-">Top Donations</h2>  
        <ul className="mt-5 ml-5">  
            {donations.map((donor, index) => (  
            <li key={index} className="donor-item">  
                <div className="flex">
                <div className="donor-icon mt-3" style={{ backgroundColor: donor.color }}><i class="fa-regular fa-user"></i></div>  
                <div className=" flex donor-info mt-1 font-semibold text-lg">  
                <span className="donor-name">{donor.name}</span>  
                <span className="donor-email">{donor.email}</span>
                </div>
                <div className="mt-3  font-semibold text-xl  ml-40">
                    <span className="ml-40">{`Rs.${donor.spend}`}</span>
                </div>
                </div>  
            </li>  
            ))}  
        </ul>  
    </div>  
    </div>  
  );  
};  
