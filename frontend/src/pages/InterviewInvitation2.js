import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Interviews.css';

const InterviewInvitation2 = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const styles = {
    container: {
      width: '100%',
      backgroundColor: '#f8fafc',
      minHeight: '100%'
    },
    header: {
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1a202c',
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
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '14px',
      color: '#718096'
    },
    interviewsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
      gap: '20px'
    },
    interviewCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease',
      border: '1px solid #e2e8f0'
    },
    interviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    candidateName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '4px'
    },
    jobTitle: {
      fontSize: '14px',
      color: '#667eea',
      fontWeight: '500'
    },
    statusBadge: {
      padding: '6px 12px',
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
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#718096'
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '16px'
    }
  };

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/api/interviews/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvitations(res.data);
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách lời mời!');
      setInvitations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
    const interval = setInterval(() => fetchInvitations(), 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled': return 'Chờ phản hồi';
      case 'completed': return 'Đã chấp nhận';
      case 'cancelled': return 'Đã từ chối';
      default: return status;
    }
  };
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'scheduled': return { ...styles.statusBadge, ...styles.statusScheduled };
      case 'completed': return { ...styles.statusBadge, ...styles.statusCompleted };
      case 'cancelled': return { ...styles.statusBadge, ...styles.statusCancelled };
      default: return styles.statusBadge;
    }
  };

  // Thống kê
  const total = invitations.length;
  const pending = invitations.filter(i => i.status === 'scheduled').length;
  const accepted = invitations.filter(i => i.status === 'completed').length;
  const rejected = invitations.filter(i => i.status === 'cancelled').length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Xem lời mời phỏng vấn</h1>
          <div style={styles.subtitle}>Theo dõi trạng thái phản hồi từ ứng viên</div>
        </div>
      </div>
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{total}</div>
          <div style={styles.statLabel}>Tổng lời mời</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{pending}</div>
          <div style={styles.statLabel}>Chờ phản hồi</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{accepted}</div>
          <div style={styles.statLabel}>Đã chấp nhận</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{rejected}</div>
          <div style={styles.statLabel}>Đã từ chối</div>
        </div>
      </div>
      <div style={styles.interviewsGrid}>
        {loading ? (
          <div style={styles.emptyState}>Đang tải...</div>
        ) : error ? (
          <div style={styles.emptyState}>{error}</div>
        ) : invitations.length === 0 ? (
          <div style={styles.emptyState}>Không có lời mời nào.</div>
        ) : (
          invitations.map((iv, idx) => (
            <div key={iv.id} style={styles.interviewCard}>
              <div style={styles.interviewHeader}>
                <div>
                  <div style={styles.candidateName}>{iv.candidate_name}</div>
                  <div style={styles.jobTitle}>{iv.job_title || iv.position}</div>
                </div>
                <span style={getStatusBadgeStyle(iv.status)}>{getStatusText(iv.status)}</span>
              </div>
              <div style={styles.interviewDetails}>
                <div style={styles.detailItem}>📅 <strong>Thời gian:</strong> {formatDateTime(iv.interview_date)}</div>
                <div style={styles.detailItem}>📍 <strong>Địa điểm:</strong> {iv.location || '-'}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InterviewInvitation2; 