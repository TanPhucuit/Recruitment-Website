import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CandidateList.css';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [showCV, setShowCV] = useState(false);
  const [cvData, setCvData] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteCandidate, setInviteCandidate] = useState(null);
  const [inviteForm, setInviteForm] = useState({ date: '', time: '', location: '' });
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontWeight: '500',
      color: '#374151',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    buttonGroup: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'flex-end',
      marginTop: '20px'
    },
    saveButton: {
      backgroundColor: '#3182ce',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 16px',
      cursor: 'pointer'
    },
    cancelButton: {
      backgroundColor: '#6b7280',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 16px',
      cursor: 'pointer'
    }
  };

  // Lấy danh sách ứng viên từ API
  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/api/applications/recruiter-candidates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched candidates:', res.data);
      setCandidates(res.data);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setCandidates([]);
    }
    setLoading(false);
  };

  useEffect(() => {
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
      const cvId = candidate.cv_id;
      if (!cvId) {
        alert('Không tìm thấy ID hồ sơ ứng viên!');
        return;
      }
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3001/api/candidate/${cvId}`,
        { headers: { Authorization: `Bearer ${token}` } });
      setCvData(res.data);
      setShowCV(true);
    } catch (err) {
      setCvData(null);
      setShowCV(false);
      alert('Không thể tải hồ sơ ứng viên!');
    }
  };

  const openInviteForm = (candidate) => {
    setInviteCandidate(candidate);
    setInviteForm({
      date: '',
      time: '',
      location: ''
    });
    setShowInviteForm(true);
    setInviteSuccess('');
  };

  const handleInviteChange = (e) => {
    setInviteForm({ ...inviteForm, [e.target.name]: e.target.value });
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteCandidate || !inviteForm.date || !inviteForm.time || !inviteForm.location) {
      setInviteSuccess('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Gửi lời mời phỏng vấn - CHỈ GỌI MỘT LẦN
      const response = await axios.post('http://localhost:3001/api/interviews', {
        application_id: inviteCandidate.application_id,
        interview_date: `${inviteForm.date} ${inviteForm.time}`,
        location: inviteForm.location
      }, { headers: { Authorization: `Bearer ${token}` } });

      console.log('Interview invitation sent:', response.data);
      setInviteSuccess('Gửi lời mời phỏng vấn thành công!');
      // Refresh candidates list
      await fetchCandidates();
      // Close modal after 1.5 seconds
      setTimeout(() => {
        setShowInviteForm(false);
        setInviteSuccess('');
      }, 1500);
    } catch (err) {
      console.error('Error sending interview invitation:', err);
      setInviteSuccess('Có lỗi khi gửi lời mời!');
    }
    setLoading(false);
  };

  // Xác định trạng thái đã mời phỏng vấn (dựa vào interview_status mới từ backend)
  const isInvited = (candidate) => {
    return candidate.interview_status === 'scheduled' || candidate.interview_status === 'completed' || candidate.interview_status === 'cancelled';
  };

  // Xử lý tick chọn từng ứng viên
  const handleCheckboxChange = (cv_id, job_title) => {
    const key = `${cv_id}-${job_title}`;
    setSelectedCandidates(prev =>
      prev.includes(key)
        ? prev.filter(id => id !== key)
        : [...prev, key]
    );
  };

  // Xử lý tick chọn tất cả
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(paginatedCandidates.map(c => `${c.cv_id}-${c.job_title}`));
    }
    setSelectAll(!selectAll);
  };

  // Gửi lời mời hàng loạt
  const handleBulkInvite = () => {
    const selected = paginatedCandidates.filter(c => selectedCandidates.includes(`${c.cv_id}-${c.job_title}`) && !isInvited(c));
    if (selected.length === 0) return;
    // Có thể mở modal gửi lời mời cho từng ứng viên hoặc gửi hàng loạt (tùy yêu cầu)
    // Ở đây demo chỉ gửi cho ứng viên đầu tiên
    openInviteForm(selected[0]);
  };

  // Hàm xóa application
  const handleDeleteApplication = async (candidate) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ ứng viên ${candidate.fullname} cho công việc "${candidate.job_title}"?`)) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/applications/${candidate.application_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCandidates();
    } catch (err) {
      alert('Xóa hồ sơ thất bại!');
    }
    setLoading(false);
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
          Quản lý và theo dõi thông tin các ứng viên đã ứng tuyển
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
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  style={{ width: 16, height: 16 }}
                />
              </th>
              <th style={styles.tableHeaderCell}>STT</th>
              <th style={styles.tableHeaderCell}>Họ và tên</th>
              <th style={styles.tableHeaderCell}>Số điện thoại</th>
              <th style={styles.tableHeaderCell}>Email</th>
              <th style={styles.tableHeaderCell}>Công việc ứng tuyển</th>
              <th style={styles.tableHeaderCell}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
            {paginatedCandidates.map((candidate, idx) => {
              const key = `${candidate.cv_id}-${candidate.job_title}`;
              return (
                <tr key={key} style={styles.tableRow}>
                  <td style={styles.tableCell}>
                    <input
                      type="checkbox"
                      checked={selectedCandidates.includes(key)}
                      onChange={() => handleCheckboxChange(candidate.cv_id, candidate.job_title)}
                      disabled={isInvited(candidate)}
                      style={{ width: 16, height: 16, accentColor: isInvited(candidate) ? '#bbb' : undefined, background: isInvited(candidate) ? '#eee' : undefined, cursor: isInvited(candidate) ? 'not-allowed' : 'pointer' }}
                    />
                  </td>
                  <td style={styles.tableCell}>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                  <td style={styles.tableCell} title={candidate.fullname}>{candidate.fullname}</td>
                  <td style={styles.tableCell} title={candidate.phone}>{candidate.phone}</td>
                  <td style={styles.tableCell} title={candidate.email}>{candidate.email}</td>
                  <td style={styles.tableCell} title={candidate.job_title}>{candidate.job_title}</td>
                  <td style={{...styles.tableCell, position: 'relative', minWidth: 200, whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset'}}>
                      <button 
                      style={{...styles.actionButton, zIndex: 2, position: 'relative', background: 'white', display: 'inline-block', pointerEvents: 'auto'}}
                        onClick={() => handleViewCV(candidate)}
                      >
                      👁️ Xem hồ sơ
                    </button>
                    <button
                      style={{...styles.actionButton, color: '#e53e3e', borderColor: '#e53e3e', zIndex: 3, position: 'relative', background: 'white', display: 'inline-block', pointerEvents: 'auto'}}
                      onClick={() => handleDeleteApplication(candidate)}
                      disabled={loading}
                    >
                      🗑️ Xóa hồ sơ
                      </button>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>

      {/* Nút gửi lời mời hàng loạt */}
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button
          style={styles.saveButton}
          onClick={handleBulkInvite}
          disabled={selectedCandidates.length === 0 || paginatedCandidates.filter(c => selectedCandidates.includes(`${c.cv_id}-${c.job_title}`) && !isInvited(c)).length === 0}
        >
          Gửi lời mời phỏng vấn cho các ứng viên đã chọn
        </button>
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
                style={styles.cancelButton}
                onClick={() => setShowCV(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Form Modal */}
      {showInviteForm && inviteCandidate && (
        <div style={styles.modal} onClick={() => setShowInviteForm(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={{marginTop: 0, color: '#2d3748'}}>Gửi lời mời phỏng vấn</h2>
            <form onSubmit={handleInviteSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Ứng viên</label>
                <div style={{fontWeight: 'bold', color: '#2d3748'}}>
                  {inviteCandidate.fullname} - {inviteCandidate.job_title}
        </div>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Ngày phỏng vấn *</label>
                <input
                  type="date"
                  name="date"
                  value={inviteForm.date}
                  onChange={handleInviteChange}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Giờ phỏng vấn *</label>
                <input
                  type="time"
                  name="time"
                  value={inviteForm.time}
                  onChange={handleInviteChange}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Địa điểm *</label>
                <input
                  type="text"
                  name="location"
                  value={inviteForm.location}
                  onChange={handleInviteChange}
                  placeholder="Nhập địa điểm phỏng vấn"
                  style={styles.input}
                  required
                />
              </div>
              
              {inviteSuccess && (
                <div style={{
                  padding: '12px',
                  marginBottom: '16px',
                  borderRadius: '6px',
                  backgroundColor: inviteSuccess.includes('thành công') ? '#d4edda' : '#f8d7da',
                  color: inviteSuccess.includes('thành công') ? '#155724' : '#721c24'
                }}>
                  {inviteSuccess}
                </div>
              )}
              
              <div style={styles.buttonGroup}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setShowInviteForm(false)}
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    ...styles.saveButton,
                    opacity: loading ? 0.7 : 1
                  }}
                  disabled={loading}
                >
                  {loading ? 'Đang gửi...' : 'Gửi lời mời'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateList; 