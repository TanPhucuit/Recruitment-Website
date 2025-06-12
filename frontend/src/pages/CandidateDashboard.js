import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CandidateDashboard.css';
import ProfileView from './ProfileView';
import ProfileCreate from './ProfileCreate';
import CVUpload from './CVUpload';
import JobSearch from './JobSearch';
import Applications from './Applications';
import Interviews from './Interviews';

const CandidateDashboard = () => {
  const [tab, setTab] = useState('profile');
  const [username, setUsername] = useState('');
  const [hasProfile, setHasProfile] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    tests: 0,
    offers: 0
  });

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
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/candidate/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHasProfile(!!res.data);
      } catch {
        setHasProfile(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/candidate/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        setStats({
          applications: 12,
          interviews: 3,
          tests: 8,
          offers: 2
        });
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/candidate/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.read).length);
      } catch (err) {
        const mockNotifications = [
          { id: 1, message: 'Có tin tuyển dụng mới phù hợp với bạn', time: '5 phút trước', read: false },
          { id: 2, message: 'Bài test của bạn đã được chấm điểm', time: '1 giờ trước', read: false },
          { id: 3, message: 'Lịch phỏng vấn đã được xác nhận', time: '2 giờ trước', read: true }
        ];
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
      }
    };
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleNotificationClick = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/api/candidate/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3001/api/candidate/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const getTabTitle = () => {
    switch(tab) {
      case 'profile': return 'Quản lý hồ sơ';
      case 'jobs': return 'Tìm kiếm việc làm';
      case 'tests': return 'Làm bài test';
      case 'interviews': return 'Lời mời phỏng vấn';
      case 'create': return 'Tạo hồ sơ';
      case 'upload': return 'Upload CV';
      default: return 'Dashboard';
    }
  };

  const renderContent = () => {
    if (tab === 'profile') {
      return hasProfile 
        ? <ProfileView username={username} />
        : <div style={{textAlign:'center', padding: '60px 20px'}}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              👤
            </div>
            <h3 style={{color: '#4a5568', marginBottom: '16px'}}>Chưa có hồ sơ</h3>
            <p style={{color: '#718096', marginBottom: '24px'}}>
              Tạo hồ sơ để bắt đầu ứng tuyển các vị trí việc làm hấp dẫn
            </p>
            <button 
              onClick={() => setTab('create')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              🚀 Tạo hồ sơ ngay
            </button>
          </div>;
    }
    switch(tab) {
      case 'create': return <ProfileCreate username={username} />;
      case 'upload': return <CVUpload username={username} />;
      case 'jobs': return <JobSearch username={username} />;
      case 'tests': return <Applications username={username} />;
      case 'interviews': return <Interviews username={username} />;
      default: return <div>Content not found</div>;
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      {/* Main dashboard UI only, no test UI */}
      {/* Enhanced Sidebar */}
      <aside 
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
              TalentHub
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

        {/* Stats Cards */}
        {!sidebarCollapsed && (
          <div style={{
            padding: '16px',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center'
              }}>
                <div style={{color: 'white', fontSize: '20px', fontWeight: 'bold'}}>
                  {stats.applications}
                </div>
                <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '11px'}}>
                  Đơn ứng tuyển
                </div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center'
              }}>
                <div style={{color: 'white', fontSize: '20px', fontWeight: 'bold'}}>
                  {stats.interviews}
                </div>
                <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '11px'}}>
                  Phỏng vấn
                </div>
        </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '20px 0' }}>
          {[
            { key: 'profile', icon: '👤', label: 'Quản lý hồ sơ' },
            { key: 'jobs', icon: '🔍', label: 'Tìm việc làm' },
            { key: 'tests', icon: '', label: 'Bài test' },
            { key: 'interviews', icon: '🤝', label: 'Phỏng vấn' }
          ].map(item => (
            <div
              key={item.key}
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
              👋 Chào {username}
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
      <main style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc'
      }}>
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
              Quản lý sự nghiệp của bạn một cách hiệu quả
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
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Enhanced Notifications Panel */}
      {showNotifications && (
        <div 
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

export default CandidateDashboard; 