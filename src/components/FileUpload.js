import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('docFile', file);

    try {
      const response = await axios.post('http://localhost:4000/api/convert', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setHtmlContent(response.data.html);
      fetchConvertedFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const fetchConvertedFiles = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/files');
      setConvertedFiles(response.data);
    } catch (error) {
      console.error('Error fetching converted files:', error);
    }
  };

  const fetchSelectedFileContent = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/files/${id}`);
      setHtmlContent(response.data);
    } catch (error) {
      console.error('Error fetching file content:', error);
    }
  };

  const handleDropdownChange = (event) => {
    const id = event.target.value;
    setSelectedFile(id);
    if (id) {
      fetchSelectedFileContent(id);
    } else {
      setHtmlContent('');
    }
  };

  useEffect(() => {
    fetchConvertedFiles();
  }, []);

  const deleteFile = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/files/${id}`);
      fetchConvertedFiles();
      setHtmlContent('');
      setSelectedFile('');
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleDelete = () => {
    if (selectedFile) {
      deleteFile(selectedFile);
    } else {
      alert('Please select a file to delete');
    }
  };

  return (
    <div className="container">
      
      <div className="left-section">
        <h1>DOC to HTML Converter</h1>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload and Convert</button>

        <h3>Select Converted File:</h3>
        <select value={selectedFile} onChange={handleDropdownChange}>
          <option value="">-- Select a file --</option>
          {convertedFiles.map((file) => (
            <option key={file.id} value={file.id}>
              {file.fileName}
            </option>
          ))}
        </select>

        <button onClick={handleDelete}>Delete Selected File</button>
      </div>

      <div className="right-section">
        <h3>Converted HTML:</h3>
        {htmlContent ? (
          <div
            style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }} // Adjust height for scrollable area
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <strong id='nocontent'>No HTML content to display.</strong>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
