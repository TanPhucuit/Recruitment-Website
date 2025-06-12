import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JobList.css';
import { toast } from 'react-toastify';

const JobSearch = () => {
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [filters, setFilters] = useState({
    location: '',
    salary: '',
    jobType: '',
    experience: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

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
      margin: 0
    },
    subtitle: {
      color: '#718096',
      fontSize: '14px',
      marginBottom: '20px',
      margin: '8px 0 20px 0'
    },
    searchSection: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '24px'
    },
    searchBar: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      marginBottom: '16px'
    },
    searchInput: {
      flex: 1,
      padding: '12px 16px 12px 48px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '16px',
      outline: 'none',
      transition: 'border-color 0.2s ease',
      position: 'relative'
    },
    searchInputWrapper: {
      position: 'relative',
      flex: 1
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#a0aec0',
      fontSize: '18px'
    },
    searchButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s ease'
    },
    filterToggle: {
      background: '#f7fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    filtersPanel: {
      display: showFilters ? 'grid' : 'none',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginTop: '16px',
      padding: '16px',
      background: '#f7fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    filterLabel: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#4a5568',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    filterSelect: {
      padding: '8px 12px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: 'white'
    },
    resultsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    resultsCount: {
      color: '#718096',
      fontSize: '14px'
    },
    sortSelect: {
      padding: '8px 12px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none'
    },
    jobsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    },
    jobCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      border: '1px solid #e2e8f0'
    },
    jobCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    jobHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    jobTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '4px',
      lineHeight: '1.3'
    },
    jobCompany: {
      fontSize: '14px',
      color: '#667eea',
      fontWeight: '500'
    },
    jobBadge: {
      background: '#edf2f7',
      color: '#4a5568',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500'
    },
    jobDetails: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginBottom: '16px'
    },
    jobDetail: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      color: '#718096'
    },
    jobDescription: {
      color: '#4a5568',
      fontSize: '14px',
      lineHeight: '1.5',
      marginBottom: '16px',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },
    jobActions: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    },
    applyButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    appliedButton: {
      background: '#e2e8f0',
      color: '#4a5568',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'not-allowed'
    },
    viewButton: {
      background: 'transparent',
      color: '#667eea',
      border: '1px solid #667eea',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      marginTop: '32px'
    },
    paginationButton: {
      padding: '8px 12px',
      border: '1px solid #e2e8f0',
      backgroundColor: 'white',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.2s ease'
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
      padding: '32px',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflowY: 'auto'
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

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/jobs');
        setJobs(res.data.filter(job => job.status === 'active'));
      } catch (err) {
        setJobs([]);
      }
      setLoading(false);
    };

    const fetchApplied = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/applications/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppliedJobIds(res.data.map(app => app.job_id));
      } catch {
        setAppliedJobIds([]);
      }
    };

    fetchJobs();
    fetchApplied();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesQuery = job.title.toLowerCase().includes(query.toLowerCase()) ||
                        job.position.toLowerCase().includes(query.toLowerCase()) ||
                        job.area.toLowerCase().includes(query.toLowerCase());
    const matchesLocation = !filters.location || job.area.includes(filters.location);
    const matchesJobType = !filters.jobType || job.job_type === filters.jobType;
    
    return matchesQuery && matchesLocation && matchesJobType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/api/candidate/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.data) {
        toast.error('Bạn cần tạo hồ sơ trước khi ứng tuyển!');
        return;
      }
      await axios.post('http://localhost:3001/api/applications', { job_id: jobId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppliedJobIds([...appliedJobIds, jobId]);
      toast.success('Ứng tuyển thành công!');
    } catch (err) {
      toast.error('Ứng tuyển thất bại!');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const formatSalary = (salary) => {
    return salary || 'Thỏa thuận';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div style={{...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '32px', marginBottom: '16px'}}>⏳</div>
          <div style={{color: '#718096'}}>Đang tải việc làm...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Tìm kiếm việc làm</h1>
        <p style={styles.subtitle}>
          Khám phá hàng nghìn cơ hội việc làm phù hợp với kỹ năng của bạn
        </p>
      </div>

      {/* Search Section */}
      <div style={styles.searchSection}>
        <form onSubmit={handleSearch} style={styles.searchBar}>
          <div style={styles.searchInputWrapper}>
            <div style={styles.searchIcon}>🔍</div>
            <input
              style={styles.searchInput}
              placeholder="Tìm kiếm theo vị trí, công ty, kỹ năng..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            style={styles.searchButton}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Tìm kiếm
          </button>
          <button
            type="button"
            style={styles.filterToggle}
            onClick={() => setShowFilters(!showFilters)}
          >
            🎛️ Bộ lọc {showFilters ? '↑' : '↓'}
          </button>
        </form>

        {/* Filters Panel */}
        <div style={styles.filtersPanel}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Địa điểm</label>
            <select
              style={styles.filterSelect}
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            >
              <option value="">Tất cả địa điểm</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP.HCM">TP. Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Cần Thơ">Cần Thơ</option>
            </select>
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Mức lương</label>
            <select
              style={styles.filterSelect}
              value={filters.salary}
              onChange={(e) => setFilters({...filters, salary: e.target.value})}
            >
              <option value="">Tất cả mức lương</option>
              <option value="10-15">10-15 triệu</option>
              <option value="15-20">15-20 triệu</option>
              <option value="20-30">20-30 triệu</option>
              <option value="30+">Trên 30 triệu</option>
            </select>
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Loại công việc</label>
            <select
              style={styles.filterSelect}
              value={filters.jobType}
              onChange={(e) => setFilters({...filters, jobType: e.target.value})}
            >
              <option value="">Tất cả loại</option>
              <option value="full-time">Toàn thời gian</option>
              <option value="part-time">Bán thời gian</option>
              <option value="contract">Hợp đồng</option>
              <option value="internship">Thực tập</option>
            </select>
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Kinh nghiệm</label>
            <select
              style={styles.filterSelect}
              value={filters.experience}
              onChange={(e) => setFilters({...filters, experience: e.target.value})}
            >
              <option value="">Tất cả cấp độ</option>
              <option value="0-1">Mới tốt nghiệp</option>
              <option value="1-3">1-3 năm</option>
              <option value="3-5">3-5 năm</option>
              <option value="5+">Trên 5 năm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={styles.resultsHeader}>
        <div style={styles.resultsCount}>
          Tìm thấy {filteredJobs.length} việc làm
          {query && ` cho "${query}"`}
        </div>
        <select style={styles.sortSelect}>
          <option value="newest">Mới nhất</option>
          <option value="salary">Lương cao nhất</option>
          <option value="relevant">Phù hợp nhất</option>
        </select>
      </div>

      {/* Jobs Grid */}
      {paginatedJobs.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🔍</div>
          <h3 style={{color: '#4a5568', marginBottom: '8px'}}>Không tìm thấy việc làm</h3>
          <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thêm cơ hội.</p>
        </div>
      ) : (
        <div style={styles.jobsGrid}>
          {paginatedJobs.map(job => (
            <div
              key={job.id}
              style={styles.jobCard}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.jobCardHover)}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              <div style={styles.jobHeader}>
                <div>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <div style={styles.jobCompany}>{job.company_name || 'Công ty'}</div>
                </div>
                <div style={styles.jobBadge}>Mới</div>
              </div>

              <div style={styles.jobDetails}>
                <div style={styles.jobDetail}>
                  📍 {job.area}
                </div>
                <div style={styles.jobDetail}>
                  💰 {formatSalary(job.salary)}
                </div>
                <div style={styles.jobDetail}>
                  ⏰ {job.job_type || 'Full-time'}
                </div>
                <div style={styles.jobDetail}>
                  📅 {formatDate(job.posted_date || new Date())}
                </div>
              </div>

              <div style={styles.jobDescription}>
                {job.requirement || 'Mô tả công việc sẽ được cập nhật sớm...'}
              </div>

              <div style={styles.jobActions}>
                <button
                  style={appliedJobIds.includes(job.id) ? styles.appliedButton : styles.applyButton}
                  onClick={() => appliedJobIds.includes(job.id) ? null : handleApply(job.id)}
                  disabled={appliedJobIds.includes(job.id)}
                >
                  {appliedJobIds.includes(job.id) ? '✓ Đã ứng tuyển' : '🚀 Ứng tuyển'}
                </button>
                <button
                  style={styles.viewButton}
                  onClick={() => setSelectedJob(job)}
                >
                  👁️ Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
                backgroundColor: currentPage === i + 1 ? '#667eea' : 'white',
                color: currentPage === i + 1 ? 'white' : '#4a5568',
                fontWeight: currentPage === i + 1 ? '600' : '400'
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

      {/* Job Detail Modal */}
      {selectedJob && (
        <div style={styles.modal} onClick={() => setSelectedJob(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px'}}>
              <div>
                <h2 style={{margin: 0, color: '#2d3748', fontSize: '24px', marginBottom: '8px'}}>
                  {selectedJob.title}
                </h2>
                <div style={{color: '#667eea', fontSize: '16px', fontWeight: '500'}}>
                  {selectedJob.company_name || 'Công ty'}
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#a0aec0'
                }}
              >
                ×
              </button>
            </div>

            <div style={{marginBottom: '24px'}}>
              <div style={styles.jobDetails}>
                <div style={styles.jobDetail}>📍 <strong>Địa điểm:</strong> {selectedJob.area}</div>
                <div style={styles.jobDetail}>💰 <strong>Lương:</strong> {formatSalary(selectedJob.salary)}</div>
                <div style={styles.jobDetail}>⏰ <strong>Loại:</strong> {selectedJob.job_type || 'Full-time'}</div>
                <div style={styles.jobDetail}>📅 <strong>Hạn nộp:</strong> {formatDate(selectedJob.deadline || new Date())}</div>
              </div>
            </div>

            <div style={{marginBottom: '24px'}}>
              <h3 style={{color: '#2d3748', marginBottom: '12px'}}>Mô tả công việc</h3>
              <div style={{lineHeight: '1.6', color: '#4a5568'}}>
                {selectedJob.requirement || 'Mô tả chi tiết sẽ được cập nhật sớm...'}
              </div>
            </div>

            {selectedJob.benefit && (
              <div style={{marginBottom: '24px'}}>
                <h3 style={{color: '#2d3748', marginBottom: '12px'}}>Quyền lợi</h3>
                <div style={{lineHeight: '1.6', color: '#4a5568'}}>
                  {selectedJob.benefit}
                </div>
              </div>
            )}

            <div style={{display: 'flex', gap: '12px'}}>
              <button
                style={appliedJobIds.includes(selectedJob.id) ? styles.appliedButton : styles.applyButton}
                onClick={() => {
                  if (!appliedJobIds.includes(selectedJob.id)) {
                    handleApply(selectedJob.id);
                    setSelectedJob(null);
                  }
                }}
                disabled={appliedJobIds.includes(selectedJob.id)}
              >
                {appliedJobIds.includes(selectedJob.id) ? '✓ Đã ứng tuyển' : '🚀 Ứng tuyển ngay'}
              </button>
              <button
                style={{
                  ...styles.viewButton,
                  backgroundColor: '#f7fafc'
                }}
                onClick={() => setSelectedJob(null)}
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

export default JobSearch; 