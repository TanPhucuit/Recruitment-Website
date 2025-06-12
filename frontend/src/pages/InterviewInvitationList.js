import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Interviews.css';
import { toast } from 'react-toastify';

const InterviewInvitationList = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

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
    refreshButton: {
      backgroundColor: '#3182ce',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
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
    },
    statusIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '12px',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500'
    },
    pendingIndicator: {
      backgroundColor: '#fff3cd',
      color: '#856404'
    },
    acceptedIndicator: {
      backgroundColor: '#d4edda',
      color: '#155724'
    },
    rejectedIndicator: {
      backgroundColor: '#f8d7da',
      color: '#721c24'
    }
  };

  const fetchInvitations = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/api/interviews/sent', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvitations(res.data);
      setError('');
      if (showRefreshToast) toast.success('🔄 Đã cập nhật danh sách lời mời!');
    } catch (err) {
      setError('Không thể tải danh sách lời mời!');
      setInvitations([]);
      if (showRefreshToast) toast.error('❌ Không thể cập nhật danh sách!');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
    const interval = setInterval(() => fetchInvitations(), 30000);
    return () => clearInterval(interval);
  }, []);

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

  const getStatusIndicatorStyle = (status) => {
    switch (status) {
      case 'scheduled':
        return styles.pendingIndicator;
      case 'completed':
        return styles.acceptedIndicator;
      case 'cancelled':
        return styles.rejectedIndicator;
      default:
        return styles.pendingIndicator;
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'scheduled':
        return '⏳ Đang chờ ứng viên phản hồi';
      case 'completed':
        return '✅ Ứng viên đã chấp nhận lời mời';
      case 'cancelled':
        return '❌ Ứng viên đã từ chối lời mời';
      default:
        return 'Trạng thái không xác định';
    }
  };

  // Calculate stats
  const stats = {
    total: invitations.length,
    pending: invitations.filter(inv => inv.status === 'scheduled').length,
    accepted: invitations.filter(inv => inv.status === 'completed').length,
    rejected: invitations.filter(inv => inv.status === 'cancelled').length
  };

  if (loading) {
    return (
      <div style={{...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '32px', marginBottom: '16px'}}>⏳</div>
          <div style={{color: '#718096'}}>Đang tải danh sách lời mời...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>❌</div>
        <h3 style={{color: '#e53e3e', marginBottom: '8px'}}>Lỗi tải dữ liệu</h3>
        <p>{error}</p>
        <button 
          onClick={() => fetchInvitations(true)}
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
        <div>
          <h1 style={styles.title}>
            📞 Quản lý lời mời phỏng vấn
          </h1>
          <p style={styles.subtitle}>
            Theo dõi trạng thái phản hồi từ ứng viên
          </p>
        </div>
        <button 
          style={{
            ...styles.refreshButton,
            opacity: refreshing ? 0.7 : 1
          }}
          onClick={() => fetchInvitations(true)}
          disabled={refreshing}
        >
          🔄 {refreshing ? 'Đang cập nhật...' : 'Làm mới'}
        </button>
      </div>

      {/* Stats */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={{...styles.statNumber, color: '#3182ce'}}>
            {stats.total}
          </div>
          <div style={styles.statLabel}>Tổng lời mời</div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statNumber, color: '#f6ad55'}}>
            {stats.pending}
          </div>
          <div style={styles.statLabel}>Chờ phản hồi</div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statNumber, color: '#48bb78'}}>
            {stats.accepted}
          </div>
          <div style={styles.statLabel}>Đã chấp nhận</div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statNumber, color: '#f56565'}}>
            {stats.rejected}
          </div>
          <div style={styles.statLabel}>Đã từ chối</div>
        </div>
      </div>

      {/* Empty state */}
      {invitations.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📞</div>
          <h3 style={{color: '#4a5568', marginBottom: '8px'}}>Chưa có lời mời phỏng vấn nào</h3>
          <p>Hãy gửi lời mời phỏng vấn cho các ứng viên từ trang "Quản lý hồ sơ ứng viên".</p>
        </div>
      ) : (
        /* Invitations Grid */
        <div style={styles.interviewsGrid}>
          {invitations.map(invitation => (
            <div
              key={invitation.id}
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
                  <h3 style={styles.candidateName}>
                    {invitation.candidate_name || 'Ứng viên'}
                  </h3>
                  <div style={styles.jobTitle}>
                    {invitation.job_title || invitation.position}
                  </div>
                </div>
                <span style={{...styles.statusBadge, ...getStatusBadgeStyle(invitation.status)}}>
                  {getStatusText(invitation.status)}
                </span>
              </div>

              {/* Details */}
              <div style={styles.interviewDetails}>
                <div style={styles.detailItem}>
                  📅 <strong>Thời gian:</strong> {formatDateTime(invitation.interview_date)}
                </div>
                <div style={styles.detailItem}>
                  📍 <strong>Địa điểm:</strong> {invitation.location || 'Chưa xác định'}
                </div>
                <div style={styles.detailItem}>
                  📧 <strong>Gửi lúc:</strong> {formatDateTime(invitation.created_at)}
                </div>
              </div>

              {/* Status Indicator */}
              <div style={{...styles.statusIndicator, ...getStatusIndicatorStyle(invitation.status)}}>
                {getStatusMessage(invitation.status)}
              </div>
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
    </div>
  );
};

export default InterviewInvitationList; 