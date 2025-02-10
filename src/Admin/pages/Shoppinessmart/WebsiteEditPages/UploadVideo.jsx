import { AiOutlineCloudUpload } from 'react-icons/ai';

const UploadVideo = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">How it works / Upload Video</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border bg-white shadow-md rounded-lg p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <AiOutlineCloudUpload className="text-4xl text-gray-400" />
            <div>
              <p className="font-medium">Drag and Drop</p>
              <p className="text-gray-500">Or</p>
              <button className="text-blue-500 hover:text-blue-600">Browse</button>
            </div>
            <p className="text-sm text-gray-500">
              Please upload Video (AVI, MP4, or MOV) with dimensions<br />
              851 x 315 pixels and a maximum file size of 150 MB.
            </p>
          </div>
        </div>
        <div className="border bg-white shadow-md rounded-lg p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-4">#</th>
                <th className="pb-4">File name</th>
                <th className="pb-4">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-3">1.</td>
                <td className="py-3 text-gray-600">How_it_works_video.MP4</td>
                <td className="py-3">
                  <button className="text-red-500 hover:text-red-600">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UploadVideo;