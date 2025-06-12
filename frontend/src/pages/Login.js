import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    loginCard: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      padding: '0',
      width: '100%',
      maxWidth: '400px',
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
    registerPrompt: {
      textAlign: 'center',
      fontSize: '14px',
      color: '#6b7280'
    },
    registerLink: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: '500',
      marginLeft: '4px'
    },
    forgotPassword: {
      textAlign: 'center',
      marginTop: '16px'
    },
    forgotPasswordLink: {
      color: '#667eea',
      textDecoration: 'none',
      fontSize: '14px'
    },
    demoCredentials: {
      background: '#f0f9ff',
      border: '1px solid #bae6fd',
      borderRadius: '8px',
      padding: '12px',
      marginTop: '20px',
      fontSize: '12px'
    },
    demoTitle: {
      fontWeight: '600',
      color: '#0c4a6e',
      marginBottom: '8px'
    },
    demoItem: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '4px',
      color: '#075985'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    setUsernameError('');
    setPasswordError('');
    setApiError('');

    if (!username.trim() || username.length < 4) {
      setUsernameError('Tên đăng nhập phải từ 4 ký tự');
      valid = false;
    }
    if (!password.trim() || password.length < 6) {
      setPasswordError('Mật khẩu phải từ 6 ký tự');
      valid = false;
    }

    if (valid) {
      setLoading(true);
      try {
        const res = await axios.post('http://localhost:3001/api/auth/login', {
          username,
          password
        });
        localStorage.setItem('token', res.data.token);
        localStorage.removeItem('appliedJobs');
        
        const role = res.data.user?.role;
        if (role === 'candidate') {
          window.location.href = '/candidate-dashboard';
        } else if (role === 'recruiter') {
          window.location.href = '/recruiter-dashboard';
        } else if (role === 'talenthub_staff') {
          window.location.href = '/talenthub-dashboard';
        } else {
          window.location.href = '/dashboard';
        }
      } catch (err) {
        setApiError(err.response?.data?.error || 'Đăng nhập thất bại!');
      }
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    const credentials = {
      candidate: { username: 'candidate01', password: 'password123' },
      recruiter: { username: 'recruiter01', password: 'password123' },
      staff: { username: 'staff01', password: 'password123' }
    };
    
    const cred = credentials[role];
    setUsername(cred.username);
    setPassword(cred.password);
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>🎯</div>
          <h1 style={styles.title}>Chào mừng trở lại</h1>
          <p style={styles.subtitle}>Đăng nhập vào TalentHub để tiếp tục</p>
        </div>

        {/* Form */}
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Tên đăng nhập</label>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    ...styles.input,
                    ...(usernameError ? styles.inputError : {})
                  }}
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
              {usernameError && (
                <div style={styles.errorMessage}>
                  ⚠️ {usernameError}
                </div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Mật khẩu</label>
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
                  placeholder="Nhập mật khẩu"
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
              {loading ? '⏳ Đang đăng nhập...' : '🚀 Đăng nhập'}
            </button>
          </form>

          {/* Forgot Password */}
          <div style={styles.forgotPassword}>
            <a href="/reset-password" style={styles.forgotPasswordLink}>
              🔐 Quên mật khẩu?
            </a>
          </div>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>hoặc</span>
          </div>

          {/* Register Prompt */}
          <div style={styles.registerPrompt}>
            Chưa có tài khoản?
            <a href="/register" style={styles.registerLink}>Đăng ký ngay</a>
          </div>

          {/* Demo Credentials */}
          <div style={styles.demoCredentials}>
            <div style={styles.demoTitle}>🧪 Tài khoản demo:</div>
            <div style={styles.demoItem}>
              <span>Ứng viên:</span>
              <button
                type="button"
                onClick={() => fillDemoCredentials('candidate')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0369a1',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '12px'
                }}
              >
                candidate01 / password123
              </button>
            </div>
            <div style={styles.demoItem}>
              <span>HR:</span>
              <button
                type="button"
                onClick={() => fillDemoCredentials('recruiter')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0369a1',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '12px'
                }}
              >
                recruiter01 / password123
              </button>
            </div>
            <div style={styles.demoItem}>
              <span>Admin:</span>
              <button
                type="button"
                onClick={() => fillDemoCredentials('staff')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0369a1',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '12px'
                }}
              >
                staff01 / password123
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 