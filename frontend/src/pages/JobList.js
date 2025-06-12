import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { apiService } from '../services/apiService';
import './JobList.css';

// Error boundary component for JobList
class JobListErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('JobList Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#e53e3e'
        }}>
          <h3>Đã xảy ra lỗi khi tải danh sách công việc</h3>
          <p>{this.state.error?.message || 'Vui lòng thử lại sau'}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Tải lại trang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    area: '',
    description: '',
    requirement: '',
    salary: '',
    job_type: 'full-time',
    benefit: '',
    deadline: ''
  });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const styles = {
    container: {
      width: '100%',
      backgroundColor: '#f8fafc',
      minHeight: '100%',
      padding: '24px'
    },
    header: {
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1a202c',
      margin: 0
    },
    searchContainer: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    },
    searchInput: {
      padding: '8px 12px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '14px',
      minWidth: '300px'
    },
    addButton: {
      backgroundColor: '#38a169',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer'
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      marginBottom: '20px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      backgroundColor: '#f7fafc'
    },
    tableHeaderCell: {
      padding: '12px 16px',
      textAlign: 'left',
      fontWeight: '600',
      color: '#4a5568',
      borderBottom: '2px solid #e2e8f0'
    },
    tableRow: {
      borderBottom: '1px solid #f7fafc'
    },
    tableCell: {
      padding: '12px 16px',
      verticalAlign: 'middle'
    },
    actionButton: {
      padding: '4px 8px',
      margin: '0 2px',
      border: 'none',
      borderRadius: '4px',
      fontSize: '12px',
      cursor: 'pointer'
    },
    editButton: {
      backgroundColor: '#3182ce',
      color: 'white'
    },
    deleteButton: {
      backgroundColor: '#e53e3e',
      color: 'white'
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
      maxWidth: '600px',
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
      color: '#374151'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px'
    },
    textarea: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      minHeight: '80px',
      resize: 'vertical'
    },
    select: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px'
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
    },
    errorText: {
      color: '#e53e3e',
      fontSize: '12px',
      marginTop: '4px'
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
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10
    },
    jobDetails: {
      marginBottom: '24px'
    },
    jobDetail: {
      marginBottom: '8px'
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.get('/api/jobs');
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Tiêu đề là bắt buộc';
    if (!formData.company_name.trim()) newErrors.company_name = 'Tên công ty là bắt buộc';
    if (!formData.area.trim()) newErrors.area = 'Địa điểm là bắt buộc';
    if (!formData.description.trim()) newErrors.description = 'Mô tả là bắt buộc';
    if (!formData.requirement.trim()) newErrors.requirement = 'Yêu cầu là bắt buộc';
    if (!formData.salary.trim()) newErrors.salary = 'Mức lương là bắt buộc';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchText.toLowerCase()) ||
    job.company_name.toLowerCase().includes(searchText.toLowerCase()) ||
    job.area.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddEdit = (job = null) => {
    setEditingJob(job);
    if (job) {
      setFormData({
        title: job.title || '',
        company_name: job.company_name || '',
        area: job.area || '',
        description: job.description || '',
        requirement: job.requirement || '',
        salary: job.salary || '',
        job_type: job.job_type || 'full-time',
        benefit: job.benefit || '',
        deadline: job.deadline ? job.deadline.split('T')[0] : ''
      });
    } else {
      setFormData({
        title: '',
        company_name: '',
        area: '',
        description: '',
        requirement: '',
        salary: '',
        job_type: 'full-time',
        benefit: '',
        deadline: ''
      });
    }
    setErrors({});
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) return;
    
    try {
      await apiService.delete(`/api/jobs/${id}`);
      toast.success('Xóa công việc thành công');
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      
      if (apiService.isApiError(error)) {
        switch (error.status) {
          case 403:
            toast.error('Bạn không có quyền xóa công việc này');
            break;
          case 404:
            toast.error('Không tìm thấy công việc cần xóa');
            break;
          default:
            toast.error(error.message || 'Không thể xóa công việc');
        }
      } else {
        toast.error('Đã xảy ra lỗi không xác định');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const jobData = {
        ...formData,
        status: 'pending',
        posted_date: new Date().toISOString().split('T')[0]
      };

      if (editingJob) {
        await apiService.put(`/api/jobs/${editingJob.id}`, jobData);
        toast.success('Cập nhật công việc thành công');
      } else {
        await apiService.post('/api/jobs', jobData);
        toast.success('Thêm công việc mới thành công');
      }
      
      setIsModalVisible(false);
      fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      
      if (apiService.isApiError(error)) {
        if (error.status === 400 && error.data) {
          // Handle validation errors from server
          setErrors(error.data);
          toast.error('Vui lòng kiểm tra lại thông tin');
        } else {
          toast.error(error.message || 'Không thể lưu công việc');
        }
      } else {
        toast.error('Đã xảy ra lỗi không xác định');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return { bg: '#c6f6d5', color: '#22543d' };
      case 'pending': return { bg: '#fff3cd', color: '#856404' };
      case 'expired': return { bg: '#fed7d7', color: '#822727' };
      default: return { bg: '#e2e8f0', color: '#4a5568' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang tuyển dụng';
      case 'pending': return 'Chờ duyệt';
      case 'expired': return 'Hết hạn';
      default: return status;
    }
  };

  return (
    <JobListErrorBoundary>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Danh sách tin tuyển dụng</h2>
          <div style={styles.searchContainer}>
        <input
              style={styles.searchInput}
              placeholder="Tìm kiếm công việc..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
        />
            <button
              style={styles.addButton}
              onClick={() => handleAddEdit()}
            >
              ➕ Thêm tin tuyển dụng
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={styles.tableContainer}>
          {loading && (
            <div style={styles.loadingOverlay}>
              <div>Đang tải...</div>
            </div>
          )}
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
          <tr>
                <th style={styles.tableHeaderCell}>Tiêu đề</th>
                <th style={styles.tableHeaderCell}>Công ty</th>
                <th style={styles.tableHeaderCell}>Địa điểm</th>
                <th style={styles.tableHeaderCell}>Mức lương</th>
                <th style={styles.tableHeaderCell}>Trạng thái</th>
                <th style={styles.tableHeaderCell}>Ngày tạo</th>
                <th style={styles.tableHeaderCell}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
              {paginatedJobs.map((job) => {
                const statusColors = getStatusColor(job.status);
                return (
                  <tr key={job.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={{ fontWeight: '600' }}>{job.title}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {job.job_type}
                      </div>
                    </td>
                    <td style={styles.tableCell}>{job.company_name}</td>
                    <td style={styles.tableCell}>{job.area}</td>
                    <td style={styles.tableCell}>{job.salary}</td>
                    <td style={styles.tableCell}>
                      <span style={{
                        backgroundColor: statusColors.bg,
                        color: statusColors.color,
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {getStatusText(job.status)}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      {formatDate(job.created_at || job.posted_date)}
                    </td>
                    <td style={styles.tableCell}>
                      <button
                        style={{...styles.actionButton, backgroundColor: '#6c63ff', color: 'white'}}
                        onClick={() => { setSelectedJob(job); setShowDetailModal(true); }}
                      >
                        👁️ Xem
                      </button>
                      <button
                        style={{...styles.actionButton, ...styles.editButton}}
                        onClick={() => handleAddEdit(job)}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        style={{...styles.actionButton, ...styles.deleteButton}}
                        onClick={() => handleDelete(job.id)}
                      >
                        🗑️ Xóa
                      </button>
              </td>
            </tr>
                );
              })}
        </tbody>
      </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              style={{
                ...styles.paginationButton,
                opacity: currentPage === 1 ? 0.5 : 1
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
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Tiếp →
            </button>
          </div>
        )}

        {/* Modal */}
        {isModalVisible && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3 style={{ marginTop: 0 }}>
                {editingJob ? 'Sửa tin tuyển dụng' : 'Thêm tin tuyển dụng mới'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Tiêu đề *</label>
                  <input
                    style={styles.input}
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Nhập tiêu đề công việc"
                  />
                  {errors.title && <div style={styles.errorText}>{errors.title}</div>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Công ty *</label>
                  <input
                    style={styles.input}
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder="Nhập tên công ty"
                  />
                  {errors.company_name && <div style={styles.errorText}>{errors.company_name}</div>}
        </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Địa điểm *</label>
                  <input
                    style={styles.input}
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="Nhập địa điểm làm việc"
                  />
                  {errors.area && <div style={styles.errorText}>{errors.area}</div>}
              </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Mô tả công việc *</label>
                  <textarea
                    style={styles.textarea}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Mô tả chi tiết về công việc"
                  />
                  {errors.description && <div style={styles.errorText}>{errors.description}</div>}
              </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Yêu cầu *</label>
                  <textarea
                    style={styles.textarea}
                    name="requirement"
                    value={formData.requirement}
                    onChange={handleInputChange}
                    placeholder="Yêu cầu kỹ năng và kinh nghiệm"
                  />
                  {errors.requirement && <div style={styles.errorText}>{errors.requirement}</div>}
              </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Mức lương *</label>
                  <input
                    style={styles.input}
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="VD: 15-20 triệu"
                  />
                  {errors.salary && <div style={styles.errorText}>{errors.salary}</div>}
              </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Loại công việc</label>
                  <select
                    style={styles.select}
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleInputChange}
                  >
                    <option value="full-time">Toàn thời gian</option>
                    <option value="part-time">Bán thời gian</option>
                    <option value="contract">Hợp đồng</option>
                    <option value="internship">Thực tập</option>
                  </select>
              </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Quyền lợi</label>
                  <textarea
                    style={styles.textarea}
                    name="benefit"
                    value={formData.benefit}
                    onChange={handleInputChange}
                    placeholder="Các quyền lợi và phúc lợi"
                  />
              </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Hạn nộp hồ sơ</label>
                  <input
                    style={styles.input}
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                  />
              </div>

                <div style={styles.buttonGroup}>
                  <button type="submit" style={styles.saveButton}>
                    {editingJob ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                  <button
                    type="button"
                    style={styles.cancelButton}
                    onClick={() => setIsModalVisible(false)}
                  >
                    Hủy
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}

        {/* Modal xem chi tiết tin tuyển dụng */}
        {showDetailModal && selectedJob && (
          <div style={styles.modal} onClick={() => setShowDetailModal(false)}>
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
                  onClick={() => setShowDetailModal(false)}
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
                  <div style={styles.jobDetail}>💰 <strong>Lương:</strong> {selectedJob.salary}</div>
                  <div style={styles.jobDetail}>⏰ <strong>Loại:</strong> {selectedJob.job_type || 'Full-time'}</div>
                  <div style={styles.jobDetail}>📅 <strong>Hạn nộp:</strong> {selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString('vi-VN') : '-'}</div>
                </div>
              </div>
              <h3 style={{color: '#2d3748', marginBottom: '12px'}}>Mô tả công việc</h3>
              <div style={{lineHeight: '1.6', color: '#4a5568', marginBottom: '16px'}}>
                {selectedJob.description || 'Mô tả chi tiết sẽ được cập nhật sớm...'}
              </div>
              <h3 style={{color: '#2d3748', marginBottom: '12px'}}>Yêu cầu</h3>
              <div style={{lineHeight: '1.6', color: '#4a5568', marginBottom: '16px'}}>
                {selectedJob.requirement || 'Yêu cầu sẽ được cập nhật sớm...'}
              </div>
              {selectedJob.benefit && (
                <>
                  <h3 style={{color: '#2d3748', marginBottom: '12px'}}>Quyền lợi</h3>
                  <div style={{lineHeight: '1.6', color: '#4a5568', marginBottom: '16px'}}>
                    {selectedJob.benefit}
                  </div>
                </>
              )}
              <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
                <button
                  style={{...styles.cancelButton, minWidth: 100}}
                  onClick={() => setShowDetailModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div style={{
            padding: '20px',
            backgroundColor: '#fff5f5',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #feb2b2'
          }}>
            <h4 style={{ color: '#c53030', margin: '0 0 10px 0' }}>
              Không thể tải danh sách công việc
            </h4>
            <p style={{ color: '#742a2a', margin: '0 0 15px 0' }}>
              {error.message || 'Vui lòng thử lại sau'}
            </p>
            <button
              onClick={fetchJobs}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3182ce',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Thử lại
            </button>
        </div>
      )}
    </div>
    </JobListErrorBoundary>
  );
};

export default JobList; 