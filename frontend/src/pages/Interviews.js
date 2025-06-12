import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Interviews.css';
import { toast } from 'react-toastify';

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  const styles = {
    container: {
      width: '100%',
      backgroundColor: '#f8fafc',
      minHeight: '100%'
    },
    header: {
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e2e8f0'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1a202c',
      marginBottom: '8px',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    subtitle: {
      color: '#718096',
      fontSize: '14px',
      margin: '8px 0 0 0'
    },
    interviewsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    },
    interviewCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease',
      border: '1px solid #e2e8f0'
    },
    interviewCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 12px rgba(0, 0, 0, 0.1)'
    },
    interviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    companyName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '4px'
    },
    jobPosition: {
      fontSize: '14px',
      color: '#667eea',
      fontWeight: '500'
    },
    statusBadge: {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      textTransform: 'uppercase'
    },
    statusScheduled: {
      background: '#fff3cd',
      color: '#856404'
    },
    statusCompleted: {
      background: '#d1ecf1',
      color: '#0c5460'
    },
    statusCancelled: {
      background: '#f8d7da',
      color: '#721c24'
    },
    interviewDetails: {
      marginBottom: '16px'
    },
    detailItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#4a5568'
    },
    interviewActions: {
      display: 'flex',
      gap: '12px',
      marginTop: '16px'
    },
    acceptButton: {
      background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      flex: 1
    },
    rejectButton: {
      background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      flex: 1
    },
    disabledButton: {
      background: '#e2e8f0',
      color: '#4a5568',
      cursor: 'not-allowed',
      opacity: 0.6
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#718096'
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '16px'
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '16px',
      height: '16px',
      border: '2px solid #ffffff',
      borderRadius: '50%',
      borderTopColor: 'transparent',
      animation: 'spin 1s ease-in-out infinite'
    }
  };

  // Fetch interviews từ API
    const fetchInterviews = async () => {
      try {
      setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/interviews/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
      
      console.log('Fetched interviews:', res.data);
      const data = Array.isArray(res.data) ? res.data : [];
      setInterviews(data);
      setError('');
      
      } catch (err) {
      console.error('Error fetching interviews:', err);
        setError('Không thể tải danh sách phỏng vấn!');
        setInterviews([]);
    } finally {
      setLoading(false);
    }
    };

  useEffect(() => {
    fetchInterviews();
    
    // Auto refresh every 30 seconds để đồng bộ trạng thái
    const interval = setInterval(fetchInterviews, 30000);
    return () => clearInterval(interval);
  }, []);

  // Xử lý chấp nhận phỏng vấn
  const handleAccept = async (interviewId) => {
    setActionLoading(prev => ({ ...prev, [interviewId]: 'accepting' }));
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/api/interviews/${interviewId}/status`, 
        { status: 'completed' }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Cập nhật state local
      setInterviews(interviews.map(interview => 
        interview.id === interviewId 
          ? { ...interview, status: 'completed' } 
          : interview
      ));
      
      toast.success('✅ Bạn đã chấp nhận lời mời phỏng vấn!');
      
      // Refresh để đảm bảo đồng bộ
      setTimeout(fetchInterviews, 1000);
      
    } catch (err) {
      console.error('Error accepting interview:', err);
      toast.error('❌ Có lỗi khi chấp nhận phỏng vấn!');
    } finally {
      setActionLoading(prev => ({ ...prev, [interviewId]: null }));
    }
  };

  // Xử lý từ chối phỏng vấn
  const handleReject = async (interviewId) => {
    if (!window.confirm('Bạn có chắc chắn muốn từ chối lời mời phỏng vấn này?')) {
      return;
    }
    
    setActionLoading(prev => ({ ...prev, [interviewId]: 'rejecting' }));
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/api/interviews/${interviewId}/status`, 
        { status: 'cancelled' }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Cập nhật state local
      setInterviews(interviews.map(interview => 
        interview.id === interviewId 
          ? { ...interview, status: 'cancelled' } 
          : interview
      ));
      
      toast.success('❌ Bạn đã từ chối lời mời phỏng vấn!');
      
      // Refresh để đảm bảo đồng bộ
      setTimeout(fetchInterviews, 1000);
      
    } catch (err) {
      console.error('Error rejecting interview:', err);
      toast.error('❌ Có lỗi khi từ chối phỏng vấn!');
    } finally {
      setActionLoading(prev => ({ ...prev, [interviewId]: null }));
    }
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    
    try {
    const date = new Date(dateString);
      return date.toLocaleString('vi-VN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh'
      });
    } catch (err) {
      return dateString;
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled':
        return 'Chờ phản hồi';
      case 'completed':
        return 'Đã chấp nhận';
      case 'cancelled':
        return 'Đã từ chối';
      default:
        return status;
    }
  };

  // Get status badge style
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'scheduled':
        return styles.statusScheduled;
      case 'completed':
        return styles.statusCompleted;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusScheduled;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={{...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '32px', marginBottom: '16px'}}>⏳</div>
          <div style={{color: '#718096'}}>Đang tải lời mời phỏng vấn...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>❌</div>
        <h3 style={{color: '#e53e3e', marginBottom: '8px'}}>Lỗi tải dữ liệu</h3>
        <p>{error}</p>
        <button 
          onClick={fetchInterviews}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3182ce',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '16px'
          }}
        >
          🔄 Thử lại
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          🤝 Lời mời phỏng vấn
        </h1>
        <p style={styles.subtitle}>
          Quản lý và phản hồi các lời mời phỏng vấn từ nhà tuyển dụng
        </p>
      </div>

      {/* Empty state */}
      {interviews.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📅</div>
          <h3 style={{color: '#4a5568', marginBottom: '8px'}}>Chưa có lời mời phỏng vấn</h3>
          <p>Hãy ứng tuyển các vị trí việc làm để nhận được lời mời phỏng vấn từ nhà tuyển dụng.</p>
        </div>
      ) : (
        /* Interviews Grid */
        <div style={styles.interviewsGrid}>
          {interviews.map(interview => (
            <div
              key={interview.id}
              style={styles.interviewCard}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.interviewCardHover)}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
              }}
            >
              {/* Header */}
              <div style={styles.interviewHeader}>
                <div>
                  <h3 style={styles.companyName}>
                    {interview.recruiter_company || 'Công ty'}
                  </h3>
                  <div style={styles.jobPosition}>
                    {interview.job_title || interview.position}
                  </div>
                </div>
                <span style={{...styles.statusBadge, ...getStatusBadgeStyle(interview.status)}}>
                  {getStatusText(interview.status)}
                </span>
              </div>

              {/* Details */}
              <div style={styles.interviewDetails}>
                <div style={styles.detailItem}>
                  📅 <strong>Thời gian:</strong> {formatDateTime(interview.interview_date)}
              </div>
                <div style={styles.detailItem}>
                  📍 <strong>Địa điểm:</strong> {interview.location || 'Chưa xác định'}
                </div>
              {interview.notes && (
                  <div style={styles.detailItem}>
                    📝 <strong>Ghi chú:</strong> {interview.notes}
                </div>
              )}
              </div>

              {/* Actions */}
              {interview.status === 'scheduled' && (
                <div style={styles.interviewActions}>
                  <button
                    style={{
                      ...styles.acceptButton,
                      ...(actionLoading[interview.id] ? styles.disabledButton : {})
                    }}
                    onClick={() => handleAccept(interview.id)}
                    disabled={!!actionLoading[interview.id]}
                  >
                    {actionLoading[interview.id] === 'accepting' ? (
                      <>
                        <span style={styles.loadingSpinner}></span> Đang xử lý...
                      </>
                    ) : (
                      '✅ Chấp nhận'
                    )}
                  </button>
                  <button
                    style={{
                      ...styles.rejectButton,
                      ...(actionLoading[interview.id] ? styles.disabledButton : {})
                    }}
                    onClick={() => handleReject(interview.id)}
                    disabled={!!actionLoading[interview.id]}
                  >
                    {actionLoading[interview.id] === 'rejecting' ? (
                      <>
                        <span style={styles.loadingSpinner}></span> Đang xử lý...
                      </>
                    ) : (
                      '❌ Từ chối'
                    )}
                  </button>
                </div>
              )}

              {/* Status Message */}
              {interview.status !== 'scheduled' && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: '500',
                  backgroundColor: interview.status === 'completed' ? '#f0fff4' : '#fff5f5',
                  color: interview.status === 'completed' ? '#22543d' : '#742a2a'
                }}>
                  {interview.status === 'completed' 
                    ? '🎉 Bạn đã chấp nhận lời mời phỏng vấn này'
                    : '❌ Bạn đã từ chối lời mời phỏng vấn này'
                  }
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Auto refresh indicator */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        🔄 Tự động cập nhật mỗi 30s
        </div>

      {/* CSS cho loading spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Interviews; 