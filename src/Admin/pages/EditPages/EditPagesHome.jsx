import React, { useState } from 'react';
import { Link } from "react-router-dom";


const EditPagesHome = () => {
  const [homeOpen, setHomeOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [aboutUsOpen, setAboutUsOpen] = useState(false);
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);

  const toggleHomeDropdown = () => {
    setHomeOpen(!homeOpen);
    setHowItWorksOpen(false);
    setAboutUsOpen(false);
    setPrivacyPolicyOpen(false);
  };

  const toggleHowItWorksDropdown = () => {
    setHowItWorksOpen(!howItWorksOpen);
    setHomeOpen(false);
    setAboutUsOpen(false);
    setPrivacyPolicyOpen(false);
  };

  const toggleAboutUsDropdown = () => {
    setAboutUsOpen(!aboutUsOpen);
    setHomeOpen(false);
    setHowItWorksOpen(false);
    setPrivacyPolicyOpen(false);
  };

  const togglePrivacyPolicyDropdown = () => {
    setPrivacyPolicyOpen(!privacyPolicyOpen);
    setHomeOpen(false);
    setHowItWorksOpen(false);
    setAboutUsOpen(false);
  };

  return (
    <div className="p-6 bg-gray-100 flex-1">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="text-xl">
            <div className='text-xl font-semibold'>
              <div onClick={toggleHomeDropdown} className='p-5 cursor-pointer flex justify-between items-center bg-slate-50 px-4 py-2 rounded-2xl  shadow-sm mt-5 mb-5'
                style={{ borderBottom: '1px solid #ccc' }}>
                Home
                <button className="text-semibold text-2xl">{homeOpen ? '-' : '+'}</button>
              </div>
              {homeOpen && (
                <div className='pl-2 pb-2 pt-3'>
                  <Link to="/admin/shoppiness/banner-image">
                  <p>Upload Banner image</p></Link>
                </div>
              )}
              <div onClick={toggleHowItWorksDropdown} className='p-5 cursor-pointer flex justify-between items-center bg-slate-50 px-4 py-2 rounded-2xl  shadow-sm mt-5 mb-5'
                style={{ borderBottom: '1px solid #ccc' }}>
                How it works
                <button className="text-semibold text-2xl">{howItWorksOpen ? '-' : '+'}</button>
              </div>
              {howItWorksOpen && (
                <div className='pl-2 pb-2 pt-3'>
                  <p>How it works video</p>
                </div>
              )}
              <div onClick={toggleAboutUsDropdown} className='p-5 cursor-pointer flex justify-between items-center bg-slate-50 px-4 py-2 rounded-2xl  shadow-sm mt-5 mb-5'
                style={{ borderBottom: '1px solid #ccc' }}>
                About Us
                <button className="text-semibold text-2xl">{aboutUsOpen ? '-' : '+'}</button>
              </div>
              {aboutUsOpen && (
                <div className='pl-2 pb-2 pt-3'>
                  <p>Write story of this platform</p>
                  <p className='mt-3'>Upload members image</p>
                </div>
              )}
              <div onClick={togglePrivacyPolicyDropdown} className='p-5 cursor-pointer flex justify-between items-center bg-slate-50 px-4 py-2 rounded-2xl  shadow-sm mt-5 mb-5'
                style={{ borderBottom: '1px solid #ccc' }}>
                Privacy Policy
                <button className="text-semibold text-2xl">{privacyPolicyOpen ? '-' : '+'}</button>
              </div>
              {privacyPolicyOpen && (
                <div className='pl-2 pb-2 pt-3'>
                  <Link to="/admin/shoppiness/privacy-policy">
                  <p>Privacy Policy content</p>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPagesHome;