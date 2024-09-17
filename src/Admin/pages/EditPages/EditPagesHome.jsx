import React, { useState } from 'react';

const EditPagesHome = () => {
  const [pages, setPages] = useState([
    { title: 'Home', content: '', isActive: false },
    { title: 'How it works', content: '', isActive: false },
    { title: 'About Us', content: '', isActive: false },
    { title: 'Privacy Policy', content: '', isActive: false },
  ]);

  const handlePageClick = (index) => {
    const updatedPages = [...pages];
    updatedPages[index].isActive = !updatedPages[index].isActive;
    setPages(updatedPages);
  };

  const handleContentChange = (index, content) => {
    const updatedPages = [...pages];
    updatedPages[index].content = content;
    setPages(updatedPages);
  };

  return (
    <div className="container">
        <div className="edit-pages">
          {pages.map((page, index) => (
            <div key={index} className="edit-page" onClick={() => handlePageClick(index)}>
              <div className="edit-page-title">{page.title}</div>
              {page.isActive && (
                <div
                  className="edit-page-content"
                  value={page.content}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                />
              )}
              <div className="edit-page-plus" onClick={() => handlePageClick(index)}>+</div>
            </div>
          ))}
        </div>
      </div>
  );
};

export default EditPagesHome;