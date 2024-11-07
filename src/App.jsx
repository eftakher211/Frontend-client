import { useState } from "react";
import img1 from "./assets/image.png"
import img2 from "./assets/pexels-photo-846741.jpeg"
import img3 from "./assets/1000009050-removebg__1_-removebg-preview.png"
import img4 from "./assets/images (1).jpg"

const columns = [
  { title: 'Incomplete', color: 'bg-red-600 ' },
  { title: 'To Do', color: 'bg-blue-600' },
  { title: 'Doing', color: 'bg-yellow-500' },
  { title: 'Under Review', color: 'bg-indigo-600' },
  { title: 'Completed', color: 'bg-green-600' },
  { title: 'Overdue', color: 'bg-gray-600' },
];

const App = () => {
  return (
    <div className="flex overflow-x-auto p-4 space-x-4">
      {columns.map((column, index) => (
        <div key={index} className="min-w-[300px] flex-shrink-0 border border-gray-300 rounded-lg bg-gray-50 shadow-lg">
          <div className={`${column.color} text-white p-3 flex justify-between rounded-t-lg`}>
            <h3 className="font-bold">{column.title}</h3>
            <span className="text-sm">0</span>
          </div>
          <div className="h-[600px] overflow-y-auto p-3 space-y-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};


const Card = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attachmentCount, setAttachmentCount] = useState(0);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex  space-x-2">
          <span>
            <img className='rounded-full w-8 h-8' src={img3} />
          </span>
          <h4 className="font-semibold">Client Name</h4>
        </div>
        <div className="flex space-x-2">
          <span>
            <img className='rounded-full w-8 h-8' src={img4} />
          </span>
          <h4 className="font-semibold">Sadik Istiak</h4>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        📰 Lorem ipsum dolor sit amet, consectetur adipiscing elit... <span className="bg-gray-100 font-bold">🗒1/2</span>
      </p>
      <div className="flex items-center text-xs text-gray-500  justify-between mb-2">
        <span>
          <img className='rounded-full w-8 h-8' src={img1} />
        </span>
        <span>
          <img className='rounded-full w-8 h-8' src={img2} />
        </span>

        <span>👥 12+</span>
        <span>💬 15</span>
        
        <span><button onClick={openModal} className="text-black-500 no-underline text-lg">
          📎 <span>{attachmentCount}</span>
        </button></span>
       
        <span>📅 30-12-2022</span>
      </div>


      {isModalOpen && (
        <AttachmentModal
          closeModal={closeModal}
          setAttachmentCount={setAttachmentCount}
        />
      )}
    </div>
  );
};


const AttachmentModal = ({ closeModal, setAttachmentCount }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);


  const handleFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  };


  const handleUpload = async () => {
    setUploading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append('files[]', file));

    try {

      const response = await fetch('http://localhost:5000/file', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();

        setAttachmentCount(result.attachmentCount || files.length);
        setFiles([]);
        closeModal();
      } else {
        alert('File upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // try

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-4">
        <h3 className="text-lg font-semibold mb-4">Upload Attachments</h3>
        <input type="file" multiple onChange={handleFileChange} className="mb-4" />

        <ul className="space-y-2 mb-4">
          {files.map((file, index) => (
            <li key={index} className="text-gray-600 text-sm">
              📄 {file.name} ({file.name.split('.').pop()})
            </li>
          ))}
        </ul>

        <div className="flex justify-end space-x-2">
          <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">
            Close
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;