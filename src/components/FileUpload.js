import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');

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
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Convert</button>
      {htmlContent && (
        <div>
          <h3>Converted HTML:</h3>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      )}
    </div>
  );
}

export default FileUpload;
