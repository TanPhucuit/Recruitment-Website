import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Interviews.css';

const InterviewList2 = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInterviews = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        // API này cần backend cung cấp: trả về tất cả lịch phỏng vấn cho staff
        const res = await axios.get('http://localhost:3001/api/interviews/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInterviews(Array.isArray(res.data) ? res.data : []);
        setError('');
      } catch (err) {
        setError('Không thể tải danh sách phỏng vấn!');
        setInterviews([]);
      }
      setLoading(false);
    };
    fetchInterviews();
  }, []);

  const styles = {
    container: {
      width: '100%',
      backgroundColor: '#f8fafc',
      minHeight: '100%',
      padding: '24px',
      boxSizing: 'border-box'
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
      margin: 0
    },
    tableWrapper: {
      width: '100%',
      overflowX: 'auto',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    },
    table: {
      width: '100%',
      minWidth: '800px',
      borderCollapse: 'collapse',
      fontSize: '14px'
    },
    tableHeader: {
      backgroundColor: '#f7fafc',
      borderBottom: '2px solid #e2e8f0'
    },
    tableHeaderCell: {
      padding: '12px 16px',
      textAlign: 'left',
      fontWeight: '600',
      color: '#4a5568',
      fontSize: '13px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      whiteSpace: 'nowrap'
    },
    tableRow: {
      borderBottom: '1px solid #f7fafc',
      transition: 'background-color 0.2s ease'
    },
    tableCell: {
      padding: '12px 16px',
      verticalAlign: 'middle',
      maxWidth: '200px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    statusBadge: {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      textTransform: 'uppercase',
      background: '#e2e8f0',
      color: '#4a5568',
      display: 'inline-block'
    },
    statusScheduled: { background: '#fff3cd', color: '#856404' },
    statusCompleted: { background: '#d1ecf1', color: '#0c5460' },
    statusCancelled: { background: '#f8d7da', color: '#721c24' },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#718096'
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled': return 'Đã lên lịch';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Danh sách lịch phỏng vấn (Staff)</h1>
      </div>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.tableHeaderCell}>STT</th>
              <th style={styles.tableHeaderCell}>Ứng viên</th>
              <th style={styles.tableHeaderCell}>Vị trí</th>
              <th style={styles.tableHeaderCell}>Ngày giờ</th>
              <th style={styles.tableHeaderCell}>Địa điểm</th>
              <th style={styles.tableHeaderCell}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={styles.emptyState}>Đang tải...</td></tr>
            ) : error ? (
              <tr><td colSpan={6} style={styles.emptyState}>{error}</td></tr>
            ) : interviews.length === 0 ? (
              <tr><td colSpan={6} style={styles.emptyState}>Không có lịch phỏng vấn nào.</td></tr>
            ) : (
              interviews.map((iv, idx) => (
                <tr key={iv.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{idx + 1}</td>
                  <td style={styles.tableCell}>{iv.candidate_name}</td>
                  <td style={styles.tableCell}>{iv.job_title || iv.position}</td>
                  <td style={styles.tableCell}>{iv.interview_date ? new Date(iv.interview_date).toLocaleString('vi-VN') : '-'}</td>
                  <td style={styles.tableCell}>{iv.location}</td>
                  <td style={getStatusBadgeStyle(iv.status)}>{getStatusText(iv.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InterviewList2; 