import React, { useState } from 'react';  
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import './SocialMedia.css';
export default function SocialMedia(){  
  const [links, setLinks] = useState([
    { platform: 'Facebook', url: '',icon:'fa-brands fa-facebook' },
    { platform: 'Instagram', url: '',icon:'fa-brands fa-instagram' },
    { platform: 'LinkedIn', url: '',icon:'fa-brands fa-linkedin' },  
    { platform: 'Select', url: '',icon:'fa-solid fa-earth-americas' },  
  ]);  

  const handleChange = (index, event) => {  
    const newLinks = [...links];  
    newLinks[index].url = event.target.value;  
    setLinks(newLinks);  
  };  

  const handleAddLink = () => {  
    setLinks([...links, { platform: 'Select', url: '' }]);  
  };  

  const handleRemoveLink = (index) => {  
    const newLinks = links.filter((_, i) => i !== index);  
    setLinks(newLinks);  
  };  

  return (  
    <div className="body bg-yellow-200 mx-auto">
            {links.map((link, index) => (  
        <div key={index} className="flex mt-5 mb-10 items-center" > 
          <i class={link.icon} id="icon"></i>
          <label className="mr-10 pl-4 text-2xl" for="select">{link.platform}</label>
          <div>  
          <input  
            type="text"  
            placeholder="Add link" 
            id="select" 
            value={link.url}  
            onChange={(event) => handleChange(index, event)}  
            className='flex mr-10 p-2 border'
          /> </div>
          <div> 
          <button className='mr-5 bg-blue-600 text-white text-2xl connect'>  
          <span className="material-symbols-outlined text-2xl">
            conversion_path
            </span>&nbsp;
            Connect  
          </button>  
          </div>
          <div>
          <IconButton aria-label="delete" class="delete" onClick={() => handleRemoveLink(index)}>
          <DeleteIcon />
          </IconButton>
          </div>
        </div>  
      ))}  
      <hr></hr>
      <div>
      <button onClick={handleAddLink} 
      className='addsocial text-2xl text-slate-600 font-semibold'>  
        + Add new social link  
      </button> 
      </div> 
    </div>
  );  
};  