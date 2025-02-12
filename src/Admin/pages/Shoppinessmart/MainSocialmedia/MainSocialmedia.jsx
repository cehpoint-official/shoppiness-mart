import { useState } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin} from "react-icons/fa6";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RxCross1 } from "react-icons/rx"; 
const socialPlatforms = [
  { id: 'facebook', name: 'Facebook', icon: FaFacebook, color: 'text-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: 'text-pink-500' },
  { id: 'FaLinkedin', name: 'LinkedIn', icon: FaLinkedin, color: 'text-blue-700' },
];
const MainSocialmedia = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [links, setLinks] = useState([]);

  const handleAddLink = () => {
    if (selectedPlatform) {
      setLinks([...links, { platform: selectedPlatform, url: '' }]);
      setSelectedPlatform('');
      setIsDropdownOpen(false);
    }
  };

  const handleRemoveLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  const getPlatformIcon = (platformId) => {
    const platform = socialPlatforms.find(p => p.id === platformId);
    const Icon = platform?.icon || RxCross1;
    return <Icon className={`w-6 h-6 ${platform?.color || 'text-gray-600'}`} />;
  };

  const getPlatformName = (platformId) => {
    return socialPlatforms.find(p => p.id === platformId)?.name || platformId;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Social Media</h2>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          {/* Links List */}
          {links.map((link, index) => (
            <div key={index} className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-3 min-w-[140px]">
                {getPlatformIcon(link.platform)}
                <span className="font-medium">{getPlatformName(link.platform)}</span>
              </div>
              <input
                type="text"
                placeholder="Add link"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Connect
              </button>
              <button
                onClick={() => handleRemoveLink(index)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <RxCross1 className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          ))}

          {/* Add New Link Section */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative min-w-[140px]">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors w-full"
              >
                {selectedPlatform ? (
                  <>
                    {getPlatformIcon(selectedPlatform)}
                    <span>{getPlatformName(selectedPlatform)}</span>
                  </>
                ) : (
                  <>
                    <MdKeyboardArrowDown className="w-6 h-6 text-gray-400" />
                    <span>Select</span>
                  </>
                )}
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {socialPlatforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => {
                        setSelectedPlatform(platform.id);
                        handleAddLink();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <platform.icon className={`w-5 h-5 ${platform.color}`} />
                      <span>{platform.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              placeholder="Add link"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Connect
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <RxCross1 className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Add New Social Link Button */}
          <button
            onClick={() => setIsDropdownOpen(true)}
            className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            + Add new social link
          </button>
        </div>
      </div>
    </div>
  );
}


export default MainSocialmedia