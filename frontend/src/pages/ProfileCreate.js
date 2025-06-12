import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfileCreate = ({ onSaved }) => {
  const [form, setForm] = useState({
    fullname: '',
    birthdate: '',
    phone: '',
    email: '',
    address: '',
    education: '',
    certificates: '',
    experience: '',
    skills: '',
    objective: '',
    linkedin: '',
    github: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

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
      margin: '8px 0 0 0'
    },
    formCard: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden'
    },
    progressHeader: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '24px',
      color: 'white'
    },
    progressTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '16px',
      margin: '0 0 16px 0'
    },
    progressBar: {
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '8px',
      height: '8px',
      overflow: 'hidden',
      marginBottom: '12px'
    },
    progressFill: {
      background: 'white',
      height: '100%',
      borderRadius: '8px',
      transition: 'width 0.3s ease',
      width: `${(currentStep / totalSteps) * 100}%`
    },
    progressText: {
      fontSize: '14px',
      opacity: 0.9
    },
    formBody: {
      padding: '32px'
    },
    stepContent: {
      display: currentStep === 1 ? 'block' : 'none'
    },
    stepTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    stepDescription: {
      color: '#718096',
      fontSize: '14px',
      marginBottom: '24px',
      lineHeight: '1.5'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
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
    required: {
      color: '#e53e3e',
      marginLeft: '4px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      outline: 'none',
      backgroundColor: '#f9fafb'
    },
    inputFocus: {
      borderColor: '#667eea',
      backgroundColor: 'white',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    },
    inputError: {
      borderColor: '#ef4444',
      backgroundColor: '#fef2f2'
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      outline: 'none',
      backgroundColor: '#f9fafb',
      minHeight: '120px',
      resize: 'vertical'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      outline: 'none',
      backgroundColor: '#f9fafb',
      cursor: 'pointer'
    },
    errorMessage: {
      color: '#ef4444',
      fontSize: '12px',
      marginTop: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '32px',
      paddingTop: '24px',
      borderTop: '1px solid #e2e8f0'
    },
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: 'none'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    },
    secondaryButton: {
      background: '#f3f4f6',
      color: '#6b7280'
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    infoBox: {
      background: '#f0f9ff',
      border: '1px solid #bae6fd',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px'
    },
    infoTitle: {
      fontWeight: '600',
      color: '#0c4a6e',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    infoText: {
      color: '#075985',
      fontSize: '14px',
      lineHeight: '1.5'
    },
    skillsInput: {
      marginBottom: '8px'
    },
    skillsHelp: {
      fontSize: '12px',
      color: '#6b7280',
      fontStyle: 'italic'
    },
    previewCard: {
      background: '#f7fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '20px'
    },
    previewTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '12px'
    },
    previewItem: {
      display: 'flex',
      marginBottom: '8px'
    },
    previewLabel: {
      minWidth: '100px',
      fontWeight: '500',
      color: '#4a5568',
      fontSize: '14px'
    },
    previewValue: {
      color: '#2d3748',
      fontSize: '14px'
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!form.fullname.trim()) newErrors.fullname = 'Họ tên là bắt buộc';
      if (!form.email.trim()) newErrors.email = 'Email là bắt buộc';
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = 'Email không hợp lệ';
      }
      if (!form.phone.trim()) newErrors.phone = 'Số điện thoại là bắt buộc';
      if (form.phone && !/^[0-9]{10,11}$/.test(form.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }
    } else if (step === 2) {
      if (!form.education.trim()) newErrors.education = 'Trình độ học vấn là bắt buộc';
      if (!form.experience.trim()) newErrors.experience = 'Kinh nghiệm là bắt buộc';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/api/candidate', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Tạo hồ sơ thành công!');
      if (onSaved) onSaved();
    } catch (err) {
      toast.error('Lỗi khi tạo hồ sơ!');
      console.error(err);
    }
    setLoading(false);
  };

  const renderStep1 = () => (
    <div style={currentStep === 1 ? {} : {display: 'none'}}>
      <h3 style={styles.stepTitle}>
        📋 Thông tin cá nhân
      </h3>
      <p style={styles.stepDescription}>
        Hãy cung cấp thông tin cơ bản về bản thân để nhà tuyển dụng có thể liên hệ với bạn.
      </p>

      <div style={styles.formGrid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Họ và tên<span style={styles.required}>*</span>
          </label>
          <input
            style={{
              ...styles.input,
              ...(errors.fullname ? styles.inputError : {})
            }}
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
          />
          {errors.fullname && (
            <div style={styles.errorMessage}>
              ⚠️ {errors.fullname}
            </div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Ngày sinh</label>
          <input
            style={styles.input}
            name="birthdate"
            type="date"
            value={form.birthdate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={styles.formGrid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Email<span style={styles.required}>*</span>
          </label>
          <input
            style={{
              ...styles.input,
              ...(errors.email ? styles.inputError : {})
            }}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@example.com"
          />
          {errors.email && (
            <div style={styles.errorMessage}>
              ⚠️ {errors.email}
            </div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Số điện thoại<span style={styles.required}>*</span>
          </label>
          <input
            style={{
              ...styles.input,
              ...(errors.phone ? styles.inputError : {})
            }}
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="0123456789"
          />
          {errors.phone && (
            <div style={styles.errorMessage}>
              ⚠️ {errors.phone}
            </div>
          )}
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Địa chỉ</label>
        <input
          style={styles.input}
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="123 Đường ABC, Quận 1, TP.HCM"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div style={currentStep === 2 ? {} : {display: 'none'}}>
      <h3 style={styles.stepTitle}>
        🎓 Thông tin nghề nghiệp
      </h3>
      <p style={styles.stepDescription}>
        Chia sẻ về trình độ học vấn, kinh nghiệm và kỹ năng của bạn để tăng cơ hội được tuyển dụng.
      </p>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Trình độ học vấn<span style={styles.required}>*</span>
        </label>
        <textarea
          style={{
            ...styles.textarea,
            ...(errors.education ? styles.inputError : {})
          }}
          name="education"
          value={form.education}
          onChange={handleChange}
          placeholder="Ví dụ: Tốt nghiệp Đại học Bách Khoa TP.HCM, chuyên ngành Công nghệ Thông tin, GPA: 3.2/4.0"
        />
        {errors.education && (
          <div style={styles.errorMessage}>
            ⚠️ {errors.education}
          </div>
        )}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Kinh nghiệm làm việc<span style={styles.required}>*</span>
        </label>
        <textarea
          style={{
            ...styles.textarea,
            ...(errors.experience ? styles.inputError : {})
          }}
          name="experience"
          value={form.experience}
          onChange={handleChange}
          placeholder="Ví dụ: 2 năm kinh nghiệm phát triển web với React và Node.js tại Công ty ABC. Tham gia xây dựng 5+ dự án e-commerce..."
        />
        {errors.experience && (
          <div style={styles.errorMessage}>
            ⚠️ {errors.experience}
          </div>
        )}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Chứng chỉ</label>
        <input
          style={styles.input}
          name="certificates"
          value={form.certificates}
          onChange={handleChange}
          placeholder="AWS Certified, Google Analytics, TOEIC 850..."
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Kỹ năng</label>
        <input
          style={{...styles.input, ...styles.skillsInput}}
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="JavaScript, React, Node.js, Python, SQL..."
        />
        <div style={styles.skillsHelp}>
          💡 Ngăn cách các kỹ năng bằng dấu phẩy
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div style={currentStep === 3 ? {} : {display: 'none'}}>
      <h3 style={styles.stepTitle}>
        🎯 Hoàn thiện hồ sơ
      </h3>
      <p style={styles.stepDescription}>
        Thêm những thông tin cuối cùng để hoàn thiện hồ sơ của bạn.
      </p>

      <div style={styles.formGroup}>
        <label style={styles.label}>Mục tiêu nghề nghiệp</label>
        <textarea
          style={styles.textarea}
          name="objective"
          value={form.objective}
          onChange={handleChange}
          placeholder="Mô tả ngắn gọn về mục tiêu nghề nghiệp và định hướng phát triển của bạn..."
        />
      </div>

      <div style={styles.formGrid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>LinkedIn</label>
          <input
            style={styles.input}
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>GitHub</label>
          <input
            style={styles.input}
            name="github"
            value={form.github}
            onChange={handleChange}
            placeholder="https://github.com/yourusername"
          />
        </div>
      </div>

      {/* Preview */}
      <div style={styles.previewCard}>
        <h4 style={styles.previewTitle}>🔍 Xem trước hồ sơ</h4>
        <div style={styles.previewItem}>
          <div style={styles.previewLabel}>Họ tên:</div>
          <div style={styles.previewValue}>{form.fullname || 'Chưa nhập'}</div>
        </div>
        <div style={styles.previewItem}>
          <div style={styles.previewLabel}>Email:</div>
          <div style={styles.previewValue}>{form.email || 'Chưa nhập'}</div>
        </div>
        <div style={styles.previewItem}>
          <div style={styles.previewLabel}>Điện thoại:</div>
          <div style={styles.previewValue}>{form.phone || 'Chưa nhập'}</div>
        </div>
        <div style={styles.previewItem}>
          <div style={styles.previewLabel}>Học vấn:</div>
          <div style={styles.previewValue}>{form.education || 'Chưa nhập'}</div>
          </div>
          </div>
          </div>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Tạo hồ sơ ứng viên</h1>
        <p style={styles.subtitle}>
          Tạo hồ sơ chuyên nghiệp để tăng cơ hội việc làm
        </p>
          </div>

      {/* Form Card */}
      <div style={styles.formCard}>
        {/* Progress Header */}
        <div style={styles.progressHeader}>
          <h2 style={styles.progressTitle}>
            Bước {currentStep} / {totalSteps}
          </h2>
          <div style={styles.progressBar}>
            <div style={styles.progressFill}></div>
          </div>
          <div style={styles.progressText}>
            {currentStep === 1 && 'Thông tin cá nhân'}
            {currentStep === 2 && 'Thông tin nghề nghiệp'}
            {currentStep === 3 && 'Hoàn thiện hồ sơ'}
          </div>
        </div>

        {/* Form Body */}
        <div style={styles.formBody}>
          <form onSubmit={handleSubmit}>
            {/* Info Box */}
            <div style={styles.infoBox}>
              <div style={styles.infoTitle}>
                💡 Mẹo tạo hồ sơ hiệu quả
              </div>
              <div style={styles.infoText}>
                {currentStep === 1 && 'Điền đầy đủ thông tin liên hệ để nhà tuyển dụng có thể dễ dàng liên hệ với bạn.'}
                {currentStep === 2 && 'Mô tả chi tiết kinh nghiệm và kỹ năng với các ví dụ cụ thể để tăng ấn tượng.'}
                {currentStep === 3 && 'Kiểm tra lại thông tin một lần nữa trước khi hoàn thành.'}
              </div>
            </div>

            {/* Step Content */}
            {renderStep1()}
            {renderStep2()}
            {renderStep3()}

            {/* Button Group */}
            <div style={styles.buttonGroup}>
              <button
                type="button"
                style={{
                  ...styles.button,
                  ...styles.secondaryButton,
                  ...(currentStep === 1 ? styles.disabledButton : {})
                }}
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                ← Quay lại
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  style={{...styles.button, ...styles.primaryButton}}
                  onClick={handleNext}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Tiếp tục →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.button,
                    ...styles.primaryButton,
                    ...(loading ? styles.disabledButton : {})
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  {loading ? '⏳ Đang tạo...' : '🎉 Hoàn thành'}
                </button>
              )}
            </div>
      </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCreate; 