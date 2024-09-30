import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

import EditPagesHome from "./EditPagesHome";
export default function Edit_Pages(){
    return(
        <div className="bg-white">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
            <div className="p-6 bg-gray-100 ">
                <h1 className="text-3xl font-normal mt-4">Edit Pages</h1>
            </div>
            <div className="bg-white rounded-3xl">    
                <EditPagesHome/>
            </div>
        </div>
      </div>
    </div>

    );
}; 