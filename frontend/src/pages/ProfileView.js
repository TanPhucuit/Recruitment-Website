import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  const styles = {
    container: {
      width: '100%',
      backgroundColor: '#f8fafc',
      minHeight: '100%'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e2e8f0'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1a202c',
      margin: 0
    },
    editButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s ease'
    },
    profileCard: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden'
    },
    profileHeader: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '32px',
      color: 'white',
      textAlign: 'center'
    },
    avatarContainer: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px auto',
      fontSize: '48px',
      border: '4px solid rgba(255,255,255,0.3)'
    },
    profileName: {
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '8px',
      margin: 0
    },
    profileTitle: {
      fontSize: '16px',
      opacity: 0.9,
      margin: 0
    },
    profileBody: {
      padding: '32px'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px'
    },
    infoSection: {
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    infoItem: {
      display: 'flex',
      marginBottom: '12px',
      padding: '12px',
      background: '#f7fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    },
    infoLabel: {
      minWidth: '120px',
      fontWeight: '500',
      color: '#4a5568',
      fontSize: '14px'
    },
    infoValue: {
      flex: 1,
      color: '#2d3748',
      fontSize: '14px',
      lineHeight: '1.5'
    },
    skillsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginTop: '8px'
    },
    skillTag: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    },
    statCard: {
      background: '#f7fafc',
      padding: '16px',
      borderRadius: '12px',
      textAlign: 'center',
      border: '1px solid #e2e8f0'
    },
    statNumber: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#667eea',
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '12px',
      color: '#718096',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
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
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflowY: 'auto'
    },
    formGroup: {
      marginBottom: '20px'
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
      padding: '12px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '16px',
      outline: 'none',
      transition: 'border-color 0.2s ease'
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '16px',
      outline: 'none',
      transition: 'border-color 0.2s ease',
      minHeight: '100px',
      resize: 'vertical'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px'
    },
    saveButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    cancelButton: {
      background: '#f3f4f6',
      color: '#6b7280',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/candidate/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
        setEditForm(res.data || {});
      } catch (err) {
        setError('Không thể tải hồ sơ!');
        setProfile(null);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3001/api/candidate/me', editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(editForm);
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
  };

  if (loading) {
    return (
      <div style={{...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '32px', marginBottom: '16px'}}>⏳</div>
          <div style={{color: '#718096'}}>Đang tải hồ sơ...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>❌</div>
        <h3 style={{color: '#e53e3e', marginBottom: '8px'}}>Lỗi tải hồ sơ</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>👤</div>
        <h3 style={{color: '#4a5568', marginBottom: '8px'}}>Chưa có hồ sơ</h3>
        <p>Hãy tạo hồ sơ để bắt đầu ứng tuyển các vị trí việc làm</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Hồ sơ của tôi</h1>
        <button
          style={styles.editButton}
          onClick={handleEdit}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          ✏️ Chỉnh sửa
        </button>
      </div>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        {/* Profile Header */}
        <div style={styles.profileHeader}>
          <div style={styles.avatarContainer}>
            {getInitials(profile.fullname)}
          </div>
          <h2 style={styles.profileName}>{profile.fullname || 'Chưa cập nhật'}</h2>
          <p style={styles.profileTitle}>{profile.position || 'Ứng viên'}</p>
        </div>

        {/* Profile Body */}
        <div style={styles.profileBody}>
          {/* Stats */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>12</div>
              <div style={styles.statLabel}>Đơn ứng tuyển</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>3</div>
              <div style={styles.statLabel}>Phỏng vấn</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>85%</div>
              <div style={styles.statLabel}>Profile hoàn thiện</div>
            </div>
          </div>

          {/* Information Grid */}
          <div style={styles.infoGrid}>
            {/* Personal Information */}
            <div style={styles.infoSection}>
              <h3 style={styles.sectionTitle}>
                📋 Thông tin cá nhân
              </h3>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Họ và tên:</div>
                <div style={styles.infoValue}>{profile.fullname || 'Chưa cập nhật'}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Ngày sinh:</div>
                <div style={styles.infoValue}>{formatDate(profile.birthdate)}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Số điện thoại:</div>
                <div style={styles.infoValue}>{profile.phone || 'Chưa cập nhật'}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Email:</div>
                <div style={styles.infoValue}>{profile.email || 'Chưa cập nhật'}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Địa chỉ:</div>
                <div style={styles.infoValue}>{profile.address || 'Chưa cập nhật'}</div>
              </div>
            </div>

            {/* Professional Information */}
            <div style={styles.infoSection}>
              <h3 style={styles.sectionTitle}>
                💼 Thông tin nghề nghiệp
              </h3>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Học vấn:</div>
                <div style={styles.infoValue}>{profile.education || 'Chưa cập nhật'}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Kinh nghiệm:</div>
                <div style={styles.infoValue}>{profile.experience || 'Chưa cập nhật'}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Chứng chỉ:</div>
                <div style={styles.infoValue}>{profile.certificates || 'Chưa có'}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>CV đã upload:</div>
                <div style={styles.infoValue}>
                  {profile.file_path ? (
                    <a 
                      href={profile.file_path} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{color: '#667eea', textDecoration: 'none'}}
                    >
                      📎 Tải xuống CV
                    </a>
                  ) : (
                    'Chưa upload'
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div style={styles.infoSection}>
            <h3 style={styles.sectionTitle}>
              🎯 Kỹ năng
            </h3>
            <div style={styles.skillsContainer}>
              {profile.skills ? profile.skills.split(',').map((skill, index) => (
                <span key={index} style={styles.skillTag}>
                  {skill.trim()}
                </span>
              )) : (
                <>
                  <span style={styles.skillTag}>JavaScript</span>
                  <span style={styles.skillTag}>React</span>
                  <span style={styles.skillTag}>Node.js</span>
                  <span style={styles.skillTag}>Python</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={{marginTop: 0, color: '#2d3748'}}>Chỉnh sửa hồ sơ</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Họ và tên *</label>
              <input
                style={styles.input}
                name="fullname"
                value={editForm.fullname || ''}
                onChange={handleInputChange}
                placeholder="Nhập họ và tên"
              />
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Ngày sinh</label>
                <input
                  style={styles.input}
                  name="birthdate"
                  type="date"
                  value={editForm.birthdate ? editForm.birthdate.split('T')[0] : ''}
                  onChange={handleInputChange}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Số điện thoại</label>
                <input
                  style={styles.input}
                  name="phone"
                  value={editForm.phone || ''}
                  onChange={handleInputChange}
                  placeholder="0123456789"
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email *</label>
              <input
                style={styles.input}
                name="email"
                type="email"
                value={editForm.email || ''}
                onChange={handleInputChange}
                placeholder="email@example.com"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Địa chỉ</label>
              <input
                style={styles.input}
                name="address"
                value={editForm.address || ''}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Học vấn</label>
              <textarea
                style={styles.textarea}
                name="education"
                value={editForm.education || ''}
                onChange={handleInputChange}
                placeholder="Mô tả trình độ học vấn"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Kinh nghiệm làm việc</label>
              <textarea
                style={styles.textarea}
                name="experience"
                value={editForm.experience || ''}
                onChange={handleInputChange}
                placeholder="Mô tả kinh nghiệm làm việc"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Chứng chỉ</label>
              <input
                style={styles.input}
                name="certificates"
                value={editForm.certificates || ''}
                onChange={handleInputChange}
                placeholder="Các chứng chỉ đã có"
              />
            </div>

            <div style={styles.buttonGroup}>
              <button style={styles.saveButton} onClick={handleSave}>
                💾 Lưu thay đổi
              </button>
              <button style={styles.cancelButton} onClick={() => setShowEditModal(false)}>
                ❌ Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView; 