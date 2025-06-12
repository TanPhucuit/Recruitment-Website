import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [accountType, setAccountType] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [accountTypeError, setAccountTypeError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const [showPopup, setShowPopup] = useState(false);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
    },
    registerCard: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      padding: '0',
      width: '100%',
      maxWidth: '500px',
      overflow: 'hidden'
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '32px 32px 24px 32px',
      textAlign: 'center',
      color: 'white'
    },
    logo: {
      fontSize: '32px',
      marginBottom: '8px'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '8px',
      margin: 0
    },
    subtitle: {
      fontSize: '14px',
      opacity: 0.9,
      margin: 0
    },
    formContainer: {
      padding: '32px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontWeight: '500',
      color: '#374151',
      fontSize: '14px'
    },
    inputWrapper: {
      position: 'relative'
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
    inputFocus: {
      borderColor: '#667eea',
      backgroundColor: 'white',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    },
    inputError: {
      borderColor: '#ef4444',
      backgroundColor: '#fef2f2'
    },
    passwordToggle: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#6b7280',
      fontSize: '18px'
    },
    errorMessage: {
      color: '#ef4444',
      fontSize: '12px',
      marginTop: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    submitButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '8px'
    },
    submitButtonHover: {
      transform: 'translateY(-1px)',
      boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)'
    },
    submitButtonLoading: {
      opacity: 0.7,
      cursor: 'not-allowed'
    },
    divider: {
      textAlign: 'center',
      margin: '24px 0',
      position: 'relative',
      color: '#6b7280',
      fontSize: '14px'
    },
    dividerLine: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: '1px',
      background: '#e5e7eb'
    },
    dividerText: {
      background: 'white',
      padding: '0 16px'
    },
    loginPrompt: {
      textAlign: 'center',
      fontSize: '14px',
      color: '#6b7280'
    },
    loginLink: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: '500',
      marginLeft: '4px'
    },
    roleInfo: {
      background: '#f0f9ff',
      border: '1px solid #bae6fd',
      borderRadius: '8px',
      padding: '12px',
      marginTop: '12px',
      fontSize: '12px'
    },
    roleTitle: {
      fontWeight: '600',
      color: '#0c4a6e',
      marginBottom: '4px'
    },
    roleDescription: {
      color: '#075985',
      lineHeight: '1.4'
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
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '400px',
      width: '90%',
      textAlign: 'center',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },
    modalIcon: {
      fontSize: '48px',
      marginBottom: '16px'
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#059669',
      marginBottom: '8px'
    },
    modalMessage: {
      color: '#6b7280',
      marginBottom: '24px',
      lineHeight: '1.5'
    },
    modalButton: {
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer'
    }
  };

  const getRoleInfo = () => {
    switch(accountType) {
      case 'candidate':
        return {
          title: '👤 Ứng viên',
          description: 'Tạo hồ sơ, tìm kiếm việc làm, ứng tuyển và theo dõi quá trình tuyển dụng.'
        };
      case 'recruiter':
        return {
          title: '🏢 Nhà tuyển dụng',
          description: 'Đăng tin tuyển dụng, quản lý ứng viên, tạo bài test và lên lịch phỏng vấn.'
        };
      case 'talenthub_staff':
        return {
          title: '⚙️ Nhân viên TalentHub',
          description: 'Quản lý hệ thống, duyệt tin tuyển dụng và hỗ trợ người dùng.'
        };
      default:
        return null;
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    
    // Reset errors
    setAccountTypeError('');
    setUsernameError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setEmailError('');
    setApiError('');

    if (!accountType) {
      setAccountTypeError('Vui lòng chọn loại tài khoản');
      valid = false;
    }
    if (!username.trim() || username.length < 4) {
      setUsernameError('Tên đăng nhập phải từ 4 ký tự');
      valid = false;
    }
    if (!password.trim() || password.length < 6) {
      setPasswordError('Mật khẩu phải từ 6 ký tự');
      valid = false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu xác nhận không khớp');
      valid = false;
    }
    if (email && !validateEmail(email)) {
      setEmailError('Email không hợp lệ');
      valid = false;
    }

    if (valid) {
      setLoading(true);
      try {
        await axios.post('http://localhost:3001/api/auth/register', {
          username,
          password,
          role: accountType,
          email,
          phone,
        });
        setShowPopup(true);
      } catch (err) {
        setApiError(err.response?.data?.error || 'Đăng ký thất bại!');
      }
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setShowPopup(false);
    window.location.href = '/login';
  };

  const roleInfo = getRoleInfo();

  return (
    <div style={styles.container}>
      <div style={styles.registerCard}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>🚀</div>
          <h1 style={styles.title}>Tạo tài khoản mới</h1>
          <p style={styles.subtitle}>Tham gia TalentHub để khám phá cơ hội</p>
        </div>

        {/* Form */}
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            {/* Account Type */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Loại tài khoản *</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                style={{
                  ...styles.select,
                  ...(accountTypeError ? styles.inputError : {})
                }}
              >
                <option value="">-- Chọn loại tài khoản --</option>
                <option value="candidate">👤 Ứng viên - Tìm việc làm</option>
                <option value="recruiter">🏢 Nhà tuyển dụng - Tuyển nhân sự</option>
                <option value="talenthub_staff">⚙️ Nhân viên TalentHub</option>
                  </select>
              {accountTypeError && (
                <div style={styles.errorMessage}>
                  ⚠️ {accountTypeError}
                </div>
              )}
              {roleInfo && (
                <div style={styles.roleInfo}>
                  <div style={styles.roleTitle}>{roleInfo.title}</div>
                  <div style={styles.roleDescription}>{roleInfo.description}</div>
                </div>
              )}
            </div>

            {/* Username */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Tên đăng nhập *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  ...styles.input,
                  ...(usernameError ? styles.inputError : {})
                }}
                placeholder="Nhập tên đăng nhập (tối thiểu 4 ký tự)"
              />
              {usernameError && (
                <div style={styles.errorMessage}>
                  ⚠️ {usernameError}
                </div>
              )}
            </div>

            {/* Password Row */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Mật khẩu *</label>
                <div style={styles.inputWrapper}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      ...styles.input,
                      paddingRight: '48px',
                      ...(passwordError ? styles.inputError : {})
                    }}
                    placeholder="Tối thiểu 6 ký tự"
                  />
                  <button
                    type="button"
                    style={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {passwordError && (
                  <div style={styles.errorMessage}>
                    ⚠️ {passwordError}
                  </div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Xác nhận mật khẩu *</label>
                <div style={styles.inputWrapper}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      ...styles.input,
                      paddingRight: '48px',
                      ...(confirmPasswordError ? styles.inputError : {})
                    }}
                    placeholder="Nhập lại mật khẩu"
                  />
                  <button
                    type="button"
                    style={styles.passwordToggle}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {confirmPasswordError && (
                  <div style={styles.errorMessage}>
                    ⚠️ {confirmPasswordError}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info Row */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    ...styles.input,
                    ...(emailError ? styles.inputError : {})
                  }}
                  placeholder="email@example.com"
                />
                {emailError && (
                  <div style={styles.errorMessage}>
                    ⚠️ {emailError}
                  </div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Số điện thoại</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={styles.input}
                  placeholder="0123456789"
                />
              </div>
            </div>

            {apiError && (
              <div style={{
                ...styles.errorMessage,
                background: '#fef2f2',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                border: '1px solid #fecaca'
              }}>
                ❌ {apiError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                ...(loading ? styles.submitButtonLoading : {})
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  Object.assign(e.target.style, styles.submitButtonHover);
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {loading ? '⏳ Đang tạo tài khoản...' : '🎉 Tạo tài khoản'}
            </button>
            </form>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>hoặc</span>
          </div>

          {/* Login Prompt */}
          <div style={styles.loginPrompt}>
            Đã có tài khoản?
            <a href="/login" style={styles.loginLink}>Đăng nhập ngay</a>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showPopup && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalIcon}>🎉</div>
            <h2 style={styles.modalTitle}>Đăng ký thành công!</h2>
            <p style={styles.modalMessage}>
              Tài khoản của bạn đã được tạo thành công. Bạn có thể đăng nhập ngay bây giờ.
            </p>
            <button style={styles.modalButton} onClick={handleContinue}>
              Đăng nhập ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register; 