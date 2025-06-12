import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Jobs.css';

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/jobs');
        setJobs(res.data);
      } catch (err) {
        setJobs([]);
      }
    };
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredJobs = jobs.filter(job => job.status === 'active' && job.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      // Kiểm tra đã có hồ sơ chưa
      const res = await axios.get('http://localhost:3001/api/candidate/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.data) {
        alert('Bạn cần tạo hồ sơ trước khi ứng tuyển!');
        return;
      }
      await axios.post('http://localhost:3001/api/applications', { job_id: jobId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Ứng tuyển thành công!');
    } catch (err) {
      alert('Ứng tuyển thất bại!');
    }
  };

  return (
    <div className="interface">
      <main className="main-content">
        <div className="search-bar">
          <div className="search-container">
            <input
              type="text"
              className="search-content"
              placeholder="Tìm kiếm công việc"
              value={searchQuery}
              onChange={handleSearch}
            />
            <div className="search-trailing">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="jobs-list">
          {filteredJobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <h3 className="job-title">{job.title}</h3>
                <span className="job-company">{job.company_name || job.company}</span>
              </div>
              <div className="job-details">
                <div className="job-location">{job.area}</div>
                <div className="job-salary">{job.salary}</div>
              </div>
              <div className="job-description">
                <p>{job.requirement}</p>
                <p><strong>Yêu cầu:</strong> {job.requirements}</p>
              </div>
              <button className="apply-button" onClick={() => handleApply(job.id)}>
                Ứng tuyển
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Jobs; 