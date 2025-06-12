import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FeedbackList.css';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/interviews/feedback', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFeedbacks(Array.isArray(res.data) ? res.data : []);
        setError(res.data && res.data.length === 0 ? 'Không có phản hồi nào.' : '');
      } catch (err) {
        setError('Không thể tải danh sách phản hồi!');
        setFeedbacks([]);
      }
      setLoading(false);
    };
    fetchFeedbacks();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="feedback-list">
      <div className="breadcrumb">Quản lý quy trình tuyển dụng &gt; Xem phản hồi</div>
      <h2 className="list-title">Xem phản hồi</h2>
      <div className="feedback-items">
        {feedbacks.length === 0 && <div>Không có phản hồi nào.</div>}
        {feedbacks.map(fb => (
          <div className={`feedback-item ${fb.status || ''}`} key={fb.id}>
            <span className="icon">
              {fb.status === 'accepted' ? (
                <span className="icon-accept">✔</span>
              ) : fb.status === 'rejected' ? (
                <span className="icon-reject">✖</span>
              ) : (
                <span className="icon-accept">✔</span>
              )}
            </span>
            <span className={`feedback-status ${fb.status}`}>{fb.status === 'accepted' ? 'Đồng ý phỏng vấn' : fb.status === 'rejected' ? 'Từ chối phỏng vấn' : 'Phản hồi'}</span>
            <span className="feedback-info">
              Ứng viên: <b>{fb.candidate_name || fb.candidate || '-'}</b> | Vị trí: <b>{fb.position || fb.job_title || '-'}</b> | Nhận xét: <b>{fb.feedback}</b>
            </span>
            <span className="close-x">×</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList; 