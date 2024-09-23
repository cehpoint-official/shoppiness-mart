import React, { useState } from 'react';  

const MenuItem = ({ title }) => {  
  const [isOpen, setIsOpen] = useState(false);  

  const toggleDropdown = () => {  
    setIsOpen(!isOpen);  
  };  

  return (  
    <div>  
      <div onClick={toggleDropdown} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ccc' }}>  
        {title} {isOpen ? '-' : '+'}  
      </div>  
      {isOpen && (  
        <div style={{ paddingLeft: '20px', paddingBottom: '10px' }}>  
          {/* Content for the dropdown can go here */}  
          <p>Details about {title}</p>  
        </div>  
      )}  
    </div>  
  );  
};  

const EditPagesHome = () => {  
  return (  
    <div style={{ width: '900px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>  
      <MenuItem title="Home" />  
      <MenuItem title="How it works" />  
      <MenuItem title="About Us" />  
      <MenuItem title="Privacy Policy" />  
    </div>  
  );  
};  

export default EditPagesHome;