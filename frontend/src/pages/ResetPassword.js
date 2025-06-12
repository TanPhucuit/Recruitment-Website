import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
  const [step, setStep] = useState(1); // 1: Enter username, 2: Enter passwords
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [usernameError, setUsernameError] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const [showPopup, setShowPopup] = useState(false);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
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
    resetCard: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      padding: '0',
      width: '100%',
      maxWidth: '450px',
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
    stepIndicator: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '24px',
      gap: '12px'
    },
    stepDot: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s ease'
    },
    stepDotActive: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    },
    stepDotInactive: {
      background: '#f3f4f6',
      color: '#9ca3af'
    },
    stepDotCompleted: {
      background: '#10b981',
      color: 'white'
    },
    stepLine: {
      width: '40px',
      height: '2px',
      background: '#e5e7eb'
    },
    stepLineActive: {
      background: '#10b981'
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
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px'
    },
    submitButton: {
      flex: 1,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    backButton: {
      background: '#f3f4f6',
      color: '#6b7280',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
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
    infoBox: {
      background: '#f0f9ff',
      border: '1px solid #bae6fd',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '20px',
      fontSize: '14px'
    },
    infoTitle: {
      fontWeight: '600',
      color: '#0c4a6e',
      marginBottom: '4px'
    },
    infoText: {
      color: '#075985',
      lineHeight: '1.4'
    },
    strengthIndicator: {
      marginTop: '8px',
      display: 'flex',
      gap: '4px'
    },
    strengthBar: {
      flex: 1,
      height: '4px',
      borderRadius: '2px',
      background: '#e5e7eb',
      transition: 'background 0.2s ease'
    },
    strengthBarActive: {
      background: '#10b981'
    },
    strengthBarMedium: {
      background: '#f59e0b'
    },
    strengthBarWeak: {
      background: '#ef4444'
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

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setUsernameError('');
    setApiError('');

    if (!username.trim() || username.length < 4) {
      setUsernameError('Tên đăng nhập phải từ 4 ký tự');
      return;
    }

    // In a real app, you might verify the username exists here
    setStep(2);
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    let valid = true;
    
    setOldPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    setApiError('');

    if (!oldPassword.trim() || oldPassword.length < 6) {
      setOldPasswordError('Mật khẩu cũ phải từ 6 ký tự');
      valid = false;
    }
    if (!newPassword.trim() || newPassword.length < 6) {
      setNewPasswordError('Mật khẩu mới phải từ 6 ký tự');
      valid = false;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu xác nhận không khớp');
      valid = false;
    }
    if (oldPassword === newPassword) {
      setNewPasswordError('Mật khẩu mới phải khác mật khẩu cũ');
      valid = false;
    }

    if (valid) {
      setLoading(true);
      try {
        await axios.post('http://localhost:3001/api/auth/reset-password', {
          username,
          oldPassword,
          newPassword
        });
        setShowPopup(true);
      } catch (err) {
        setApiError(err.response?.data?.error || 'Đổi mật khẩu thất bại!');
      }
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setShowPopup(false);
    window.location.href = '/login';
  };

  return (
    <div style={styles.container}>
      <div style={styles.resetCard}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>🔐</div>
          <h1 style={styles.title}>Đặt lại mật khẩu</h1>
          <p style={styles.subtitle}>
            {step === 1 ? 'Nhập tên đăng nhập để tiếp tục' : 'Nhập mật khẩu cũ và mật khẩu mới'}
          </p>
        </div>

        {/* Form */}
        <div style={styles.formContainer}>
          {/* Step Indicator */}
          <div style={styles.stepIndicator}>
            <div style={{
              ...styles.stepDot,
              ...(step === 1 ? styles.stepDotActive : styles.stepDotCompleted)
            }}>
              {step === 1 ? '1' : '✓'}
            </div>
            <div style={{
              ...styles.stepLine,
              ...(step === 2 ? styles.stepLineActive : {})
            }}></div>
            <div style={{
              ...styles.stepDot,
              ...(step === 2 ? styles.stepDotActive : styles.stepDotInactive)
            }}>
              2
            </div>
          </div>

          {step === 1 ? (
            <>
              {/* Step 1: Username */}
              <div style={styles.infoBox}>
                <div style={styles.infoTitle}>ℹ️ Xác thực tài khoản</div>
                <div style={styles.infoText}>
                  Nhập tên đăng nhập của bạn để tiếp tục quá trình đặt lại mật khẩu.
        </div>
              </div>

              <form onSubmit={handleStep1Submit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Tên đăng nhập</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      ...styles.input,
                      ...(usernameError ? styles.inputError : {})
                    }}
                    placeholder="Nhập tên đăng nhập của bạn"
                    autoFocus
                  />
                  {usernameError && (
                    <div style={styles.errorMessage}>
                      ⚠️ {usernameError}
                    </div>
                  )}
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
                  style={styles.submitButton}
                  onMouseEnter={(e) => {
                    Object.assign(e.target.style, styles.submitButtonHover);
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  🔍 Tiếp tục
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Step 2: Passwords */}
              <div style={styles.infoBox}>
                <div style={styles.infoTitle}>🔒 Đổi mật khẩu</div>
                <div style={styles.infoText}>
                  Nhập mật khẩu cũ và tạo mật khẩu mới (mật khẩu mới chỉ cần khác mật khẩu cũ, tối thiểu 6 ký tự).
                </div>
              </div>

              <form onSubmit={handleStep2Submit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Mật khẩu hiện tại</label>
                  <div style={styles.inputWrapper}>
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      style={{
                        ...styles.input,
                        paddingRight: '48px',
                        ...(oldPasswordError ? styles.inputError : {})
                      }}
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <button
                      type="button"
                      style={styles.passwordToggle}
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {oldPasswordError && (
                    <div style={styles.errorMessage}>
                      ⚠️ {oldPasswordError}
                    </div>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Mật khẩu mới</label>
                  <div style={styles.inputWrapper}>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{
                        ...styles.input,
                        paddingRight: '48px',
                        ...(newPasswordError ? styles.inputError : {})
                      }}
                      placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    />
                    <button
                      type="button"
                      style={styles.passwordToggle}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {newPasswordError && (
                    <div style={styles.errorMessage}>
                      ⚠️ {newPasswordError}
                    </div>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Xác nhận mật khẩu mới</label>
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
                      placeholder="Nhập lại mật khẩu mới"
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

                <div style={styles.buttonGroup}>
                  <button
                    type="button"
                    style={styles.backButton}
                    onClick={() => setStep(1)}
                  >
                    ← Quay lại
                  </button>
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
                    {loading ? '⏳ Đang xử lý...' : '🔐 Đổi mật khẩu'}
                  </button>
              </div>
            </form>
            </>
          )}

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>hoặc</span>
          </div>

          {/* Login Prompt */}
          <div style={styles.loginPrompt}>
            Nhớ mật khẩu?
            <a href="/login" style={styles.loginLink}>Đăng nhập ngay</a>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showPopup && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalIcon}>🎉</div>
            <h2 style={styles.modalTitle}>Đổi mật khẩu thành công!</h2>
            <p style={styles.modalMessage}>
              Mật khẩu của bạn đã được cập nhật thành công. Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.
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

export default ResetPassword; 