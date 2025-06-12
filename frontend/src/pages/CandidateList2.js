import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CandidateList.css';

const CandidateList2 = () => {
  const [candidates, setCandidates] = useState([]);
  const [showCV, setShowCV] = useState(false);
  const [cvData, setCvData] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    subtitle: {
      color: '#718096',
      fontSize: '14px',
      marginBottom: '20px',
      margin: '8px 0 20px 0'
    },
    searchForm: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      marginBottom: '16px',
      flexWrap: 'wrap'
    },
    searchInput: {
      minWidth: '300px',
      height: '40px',
      fontSize: '14px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      padding: '0 12px',
      outline: 'none',
      transition: 'border-color 0.2s ease',
      boxSizing: 'border-box'
    },
    button: {
      height: '40px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '500',
      padding: '0 20px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.2s ease',
      backgroundColor: '#3182ce',
      color: 'white'
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
    actionButton: {
      padding: '6px 12px',
      fontSize: '12px',
      borderRadius: '6px',
      border: '1px solid #3182ce',
      color: '#3182ce',
      backgroundColor: 'white',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginRight: '8px'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      marginTop: '20px'
    },
    paginationButton: {
      padding: '8px 12px',
      border: '1px solid #e2e8f0',
      backgroundColor: 'white',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflowY: 'auto'
    },
    buttonGroup: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'flex-end',
      marginTop: '20px'
    },
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/talenthub/candidates', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCandidates(res.data);
      } catch (err) {
        setCandidates([]);
      }
      setLoading(false);
    };
    fetchCandidates();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const filteredCandidates = candidates.filter(c => {
    if (!searchInput) return true;
    const searchStr = `${c.fullname} ${c.email} ${c.phone}`.toLowerCase();
    return searchStr.includes(searchInput.toLowerCase());
  });

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewCV = async (candidate) => {
    try {
      const cvId = candidate.id;
      if (!cvId) {
        alert('Không tìm thấy ID hồ sơ ứng viên!');
        return;
      }
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3001/api/talenthub/candidate/${cvId}`,
        { headers: { Authorization: `Bearer ${token}` } });
      setCvData(res.data);
      setShowCV(true);
    } catch (err) {
      setCvData(null);
      setShowCV(false);
      alert('Không thể tải hồ sơ ứng viên!');
    }
  };

  if (loading && candidates.length === 0) {
    return (
      <div style={{...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '32px', marginBottom: '16px'}}>⏳</div>
          <div style={{color: '#718096'}}>Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Danh sách ứng viên</h1>
        <p style={styles.subtitle}>
          Chỉ xem thông tin ứng viên, không có quyền thao tác
        </p>
        {/* Search */}
        <form style={styles.searchForm} onSubmit={handleSearch}>
          <input
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          <button type="submit" style={styles.button}>
            🔍 Tìm kiếm
          </button>
        </form>
        <div style={{fontSize: '14px', color: '#718096'}}>
          Hiển thị {paginatedCandidates.length} trong tổng số {filteredCandidates.length} ứng viên
        </div>
      </div>
      {/* Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.tableHeaderCell}>STT</th>
              <th style={styles.tableHeaderCell}>Họ và tên</th>
              <th style={styles.tableHeaderCell}>Số điện thoại</th>
              <th style={styles.tableHeaderCell}>Email</th>
              <th style={styles.tableHeaderCell}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCandidates.map((candidate, idx) => (
              <tr key={candidate.id} style={styles.tableRow}>
                <td style={styles.tableCell}>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                <td style={styles.tableCell} title={candidate.fullname}>{candidate.fullname}</td>
                <td style={styles.tableCell} title={candidate.phone}>{candidate.phone}</td>
                <td style={styles.tableCell} title={candidate.email}>{candidate.email}</td>
                <td style={{...styles.tableCell, position: 'relative', minWidth: 120}}>
                  <button
                    style={{...styles.actionButton, zIndex: 2, position: 'relative', background: 'white', display: 'inline-block', pointerEvents: 'auto'}}
                    onClick={() => handleViewCV(candidate)}
                  >
                    👁️ Xem hồ sơ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            style={{
              ...styles.paginationButton,
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Trước
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              style={{
                ...styles.paginationButton,
                backgroundColor: currentPage === i + 1 ? '#3182ce' : 'white',
                color: currentPage === i + 1 ? 'white' : '#4a5568'
              }}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            style={{
              ...styles.paginationButton,
              opacity: currentPage === totalPages ? 0.5 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Tiếp →
          </button>
        </div>
      )}
      {/* CV Modal */}
      {showCV && cvData && (
        <div style={styles.modal} onClick={() => setShowCV(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={{marginTop: 0, color: '#2d3748'}}>Thông tin chi tiết ứng viên</h2>
            <div style={{lineHeight: '1.6'}}>
              <p><strong>Họ tên:</strong> {cvData.fullname}</p>
              <p><strong>Email:</strong> {cvData.email}</p>
              <p><strong>Số điện thoại:</strong> {cvData.phone}</p>
              <p><strong>Địa chỉ:</strong> {cvData.address}</p>
              <p><strong>Học vấn:</strong> {cvData.education}</p>
              <p><strong>Kinh nghiệm:</strong> {cvData.experience}</p>
              <p><strong>Chứng chỉ:</strong> {cvData.certificates}</p>
            </div>
            <div style={styles.buttonGroup}>
              <button
                style={styles.button}
                onClick={() => setShowCV(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateList2; 