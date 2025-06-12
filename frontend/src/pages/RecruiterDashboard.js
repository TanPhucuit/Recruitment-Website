import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CandidateDashboard.css';
import JobList from './JobList';
import TestList from './TestList';
import InterviewList from './InterviewList';
import CandidateList from './CandidateList';
import InterviewInvitationList from './InterviewInvitationList';

const RecruiterDashboard = () => {
  const [tab, setTab] = useState('jobs');
  const [username, setUsername] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsername(res.data.username || res.data.name || '');
      } catch (err) {
        setUsername('');
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const mockNotifications = [
      { id: 1, message: 'Có ứng viên mới ứng tuyển vào vị trí Lập trình viên Java', time: '5 phút trước', read: false },
      { id: 2, message: 'Bài test Java cơ bản đã được tạo thành công', time: '1 giờ trước', read: false },
      { id: 3, message: 'Lịch phỏng vấn với Nguyễn Văn A đã được xác nhận', time: '2 giờ trước', read: true }
    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getTabTitle = () => {
    switch(tab) {
      case 'jobs': return 'Quản lý tin tuyển dụng';
      case 'candidates': return 'Quản lý hồ sơ ứng viên';
      case 'tests': return 'Quản lý bài test';
      case 'interview-invitations': return 'Quản lý lời mời phỏng vấn';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="recruiter-layout">
      {/* Enhanced Sidebar */}
      <aside 
        className="sidebar" 
        style={{
          width: sidebarCollapsed ? '60px' : '280px',
          transition: 'width 0.3s ease',
          flexShrink: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Sidebar Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {!sidebarCollapsed && (
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
              TalentHub Pro
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '8px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="nav-options" style={{ flex: 1, padding: '20px 0' }}>
          {[
            { key: 'jobs', icon: '📝', label: 'Quản lý tin tuyển dụng' },
            { key: 'candidates', icon: '👥', label: 'Quản lý hồ sơ ứng viên' },
            { key: 'tests', icon: '📋', label: 'Quản lý bài test' },
            { key: 'interview-invitations', icon: '📞', label: 'Quản lý lời mời phỏng vấn' }
          ].map(item => (
            <div
              key={item.key}
              className={`nav-item ${tab === item.key ? 'active' : ''}`}
              onClick={() => setTab(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 20px',
                margin: '4px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: tab === item.key ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: 'white',
                fontSize: '14px',
                fontWeight: tab === item.key ? '600' : '400'
              }}
            >
              <span style={{ marginRight: sidebarCollapsed ? '0' : '12px', fontSize: '16px' }}>
                {item.icon}
              </span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginBottom: '8px' }}>
              👤 {username}
            </div>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '8px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Đăng xuất
            </button>
          </div>
        )}
      </aside>

      {/* Enhanced Main Content */}
      <main 
        className="main-content" 
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f8fafc'
        }}
      >
        {/* Header Bar */}
        <header style={{
          background: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '24px', 
              fontWeight: '700',
              color: '#1a202c'
            }}>
              {getTabTitle()}
            </h1>
            <p style={{ 
              margin: '4px 0 0 0', 
              color: '#718096', 
              fontSize: '14px' 
            }}>
              Quản lý hiệu quả quy trình tuyển dụng
            </p>
          </div>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                position: 'relative',
                background: '#f7fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🔔
              {unreadCount > 0 && (
                <span style={{
                  background: '#e53e3e',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div style={{ 
          flex: 1, 
          padding: '24px',
          overflow: 'auto'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            minHeight: 'calc(100vh - 140px)',
            padding: '24px'
          }}>
            {tab === 'jobs' && <JobList />}
            {tab === 'candidates' && <CandidateList />}
            {tab === 'tests' && <TestList />}
            {tab === 'interview-invitations' && <InterviewInvitationList />}
          </div>
        </div>
      </main>

      {/* Enhanced Notifications Panel */}
      {showNotifications && (
        <div 
          className="notification-overlay" 
          onClick={() => setShowNotifications(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000
          }}
        >
          <div 
            className="notification-panel" 
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: '70px',
              right: '24px',
              width: '360px',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              maxHeight: '500px',
              overflow: 'hidden'
            }}
          >
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h6 style={{ margin: 0, fontWeight: '600' }}>Thông báo</h6>
              <button 
                onClick={handleMarkAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3182ce',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Đánh dấu đã đọc
              </button>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#718096' }}>
                  Không có thông báo mới
                </div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    onClick={() => handleNotificationClick(notification.id)}
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid #f7fafc',
                      cursor: 'pointer',
                      backgroundColor: !notification.read ? '#f0fff4' : 'white',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <div style={{ 
                      fontSize: '14px', 
                      lineHeight: '1.4',
                      marginBottom: '4px',
                      fontWeight: !notification.read ? '500' : '400'
                    }}>
                      {notification.message}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#718096' 
                    }}>
                      {notification.time}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard; 