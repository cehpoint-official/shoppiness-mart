import React, { useState } from 'react';  

const SocialLinks = () => {  
  const [links, setLinks] = useState([  
    { platform: 'Facebook', url: '' },  
    { platform: 'Instagram', url: '' },  
    { platform: 'LinkedIn', url: '' },  
  ]);  
  const [newLink, setNewLink] = useState({ platform: '', url: '' });  

  const handleInputChange = (index, event) => {  
    const newLinks = [...links];  
    newLinks[index].url = event.target.value;  
    setLinks(newLinks);  
  };  

  const handleAddLink = () => {  
    if (newLink.platform && newLink.url) {  
      setLinks([...links, newLink]);  
      setNewLink({ platform: '', url: '' });  
    }  
  };  

  const handleRemoveLink = (index) => {  
    const newLinks = links.filter((_, i) => i !== index);  
    setLinks(newLinks);  
  };  

  return (  
    <div>  
      {links.map((link, index) => (  
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>  
          <span>{link.platform}</span>  
          <input  
            type="text"  
            placeholder="Add link"  
            value={link.url}  
            onChange={(event) => handleInputChange(index, event)}  
            style={{ marginLeft: '10px', marginRight: '10px' }}  
          />  
          <button>Connect</button>  
          <button onClick={() => handleRemoveLink(index)} style={{ marginLeft: '10px' }}>X</button>  
        </div>  
      ))}  
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>  
        <select  
          value={newLink.platform}  
          onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}  
        >  
          <option value="">Select</option>  
          <option value="Facebook">Facebook</option>  
          <option value="Instagram">Instagram</option>  
          <option value="LinkedIn">LinkedIn</option>  
        </select>  
        <input  
          type="text"  
          placeholder="Add link"  
          value={newLink.url}  
          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}  
          style={{ marginLeft: '10px', marginRight: '10px' }}  
        />  
        </div>
        <button onClick={handleAddLink}>+ Add new social link</button>    
    </div>  
  );  
};  

export default SocialLinks;

<div className="flex mt-5 mb-10 items-center" >
        <select  
          value={newLink.platform}  
          onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
          className='mr-10 pl-4 text-2xl'>  
          <option value="">Select</option>  
          <option value="Facebook">Facebook</option>  
          <option value="Instagram">Instagram</option>  
          <option value="LinkedIn">LinkedIn</option>  
        </select>  
        <input  
          type="text"  
          placeholder="Add link"  
          value={newLink.url}  
          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}  
          className='flex mr-10 p-2 border'  
        /> 
        <button className='mr-5 bg-blue-600 text-white text-2xl connect'>  
          <span className="material-symbols-outlined text-2xl">
            conversion_path
            </span>&nbsp;
            Connect  
          </button>  
          <IconButton aria-label="delete" class="delete" onClick={() => handleRemoveLink(index)}>
          <DeleteIcon />
          </IconButton>
      </div>