import React, { useState } from 'react';
import axios from 'axios';

const CVUpload = ({ onUploaded }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Vui lòng chọn file CV để upload!');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('cv', file);
      await axios.post('http://localhost:3001/api/candidate/upload-cv', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('Upload thành công!');
      setFile(null);
      if (onUploaded) onUploaded();
    } catch (err) {
      setError('Lỗi khi upload CV!');
    }
    setLoading(false);
  };

  return (
    <div className="cv-upload">
      <h2 className="profile-title">Upload CV</h2>
      <form className="cv-upload-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="file" className="form-input" onChange={handleChange} accept=".pdf,.doc,.docx" />
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <button className="action-button" type="submit" disabled={loading}>{loading ? 'Đang upload...' : 'Upload'}</button>
      </form>
    </div>
  );
};

export default CVUpload; 