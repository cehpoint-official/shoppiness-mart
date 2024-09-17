import React, { useState } from 'react';  
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
export default function SocialMedia(){  
  const [links, setLinks] = useState([  
    { platform: 'Facebook', url: '' },  
    { platform: 'Instagram', url: '' },  
    { platform: 'LinkedIn', url: '' },  
    { platform: 'Select', url: '' },  
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
    <div>  
      {links.map((link, index) => (  
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>  
          <i className="fa-brands fa-facebook"></i>
          <span style={{ marginRight: '10px' }}>{link.platform}</span>  
          <input  
            type="text"  
            placeholder="Add link"  
            value={link.url}  
            onChange={(event) => handleChange(index, event)}  
            className='flex mr-10 p-2 rounded-xl border-solid border-slate-300'
          />  
          <button style={{ marginRight: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 12px' }}>  
          <span class="material-symbols-outlined">
            conversion_path
            </span>
            Connect  
          </button>  
          
          <IconButton aria-label="delete" onClick={() => handleRemoveLink(index)}>
        <DeleteIcon />
      </IconButton>
        </div>  
      ))}  
      <button onClick={handleAddLink} style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>  
        + Add new social link  
      </button>  
    </div>  
  );  
};  