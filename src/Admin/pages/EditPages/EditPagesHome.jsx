import React, { useState } from 'react';  

const EditPagesHome = () => {
  const policies = [
    { id: 1, title: "Home " },
    { id: 2, title: "How it works" },
    { id: 3, title: "About Us" },
    { id: 4, title: "Privacy policy" },
  ];

  return (
        <div className="p-6 bg-gray-100 flex-1">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
              <div className="text-xl">
                {policies.map((policy) => (
                  <div
                    key={policy.id='1'}
                    className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-2xl  shadow-sm mt-10 mb-10"
                  >
                    <span>{policy.title}</span>
                    <button className="text-blue-500">
                      <i class="fa-solid fa-pencil"></i>Edit</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
  );
};

export default EditPagesHome;


/*
const MenuItem = ({ title }) => {  
  const [isOpen, setIsOpen] = useState(false);  

  const toggleDropdown = () => {  
    setIsOpen(!isOpen);  
  };  

  return (  
    <div className='text-xl font-semibold'>  
      <div onClick={toggleDropdown} className='p-5 cursor-pointer'style={{ borderBottom: '1px solid #ccc' }}>  
        Home {isOpen ? '-' : '+'}  
      </div>  
      {isOpen && (  
        <div className='pl-2 pb-2 pt-3'>   
          /*<p>Upload Banner image</p>  
        </div>  
      )}  
    </div>  
  );  
};  

const EditPagesHome = () => {  
  return (  
    <div style={{ width: '900px',height: '500px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' ,marginTop:'50px',marginLeft:'200px'}}>  
      <MenuItem title="Home" />  
      <MenuItem title="How it works" />  
      <MenuItem title="About Us" />  
      <MenuItem title="Privacy Policy" />  
    </div>  
  );  
};  

export default EditPagesHome;
*/