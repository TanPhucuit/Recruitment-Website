import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './JobList.css';

const ApproveJobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedId, setApprovedId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Lấy toàn bộ tin tuyển dụng
      const res = await axios.get('http://localhost:3001/api/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data);
    } catch {
      setJobs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/api/jobs/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApprovedId(id);
      setSuccessMsg('Duyệt thành công!');
      setTimeout(() => setSuccessMsg(''), 2000);
      fetchJobs();
    } catch {}
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="job-list">
      <div className="list-title">Duyệt tin tuyển dụng</div>
      {successMsg && <div style={{color:'#219653',fontWeight:'bold',marginBottom:12}}>{successMsg}</div>}
      <div className="jobs-list">
        {jobs.length === 0 && <div>Không có tin tuyển dụng.</div>}
        {jobs.map(job => (
          <div className="job-card" key={job.id} style={{background:'#f3e8ff',marginBottom:16,padding:20,borderRadius:12}}>
            <div className="job-title" style={{fontWeight:'bold',fontSize:20,color:'#7c3aed'}}>{job.title}</div>
            <div><b>Công ty:</b> {job.company_name}</div>
            <div><b>Ngày đăng:</b> {job.posted_date}</div>
            <div><b>Mức lương:</b> {job.salary}</div>
            <div><b>Quyền lợi:</b> {job.benefit}</div>
            <div style={{marginTop:8}}>
              <b>Trạng thái:</b> {job.status === 'pending' ? <span style={{color:'#e67e22'}}>Chờ duyệt</span> : <span style={{color:'#219653'}}>Đã duyệt</span>}
            </div>
            {job.status === 'pending' ? (
              <button className="add-btn" style={{marginTop:12}} onClick={()=>handleApprove(job.id)}>
                {approvedId === job.id && successMsg ? 'Đã duyệt' : 'Duyệt'}
              </button>
            ) : (
              <button className="add-btn" style={{marginTop:12,background:'#bbb',cursor:'default'}} disabled>
                Đã duyệt
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApproveJobList; 