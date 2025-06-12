import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './CandidateDashboard.css';
import ApproveJobList from './ApproveJobList';
import CandidateList2 from './CandidateList2';
import InterviewInvitation2 from './InterviewInvitation2';

function getTabFromQuery(search) {
  const params = new URLSearchParams(search);
  return params.get('tab') || 'approve';
}

const TalentHubDashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState(getTabFromQuery(location.search));
  const [username, setUsername] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState({
    pendingJobs: 0,
    totalCandidates: 0,
    feedbacks: 0,
    activeJobs: 0
  });

  useEffect(() => {
    setTab(getTabFromQuery(location.search));
  }, [location.search]);

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
    // Mock notifications for TalentHub staff
    const mockNotifications = [
      { id: 1, message: 'Có 5 tin tuyển dụng mới cần duyệt', time: '10 phút trước', read: false },
      { id: 2, message: 'Phản hồi mới từ ứng viên về quá trình phỏng vấn', time: '30 phút trước', read: false },
      { id: 3, message: 'Đã duyệt thành công 12 tin tuyển dụng hôm nay', time: '1 giờ trước', read: true },
      { id: 4, message: 'Báo cáo tháng đã được tạo và gửi email', time: '2 giờ trước', read: true }
    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);

    // Mock stats for TalentHub dashboard
    setStats({
      pendingJobs: 8,
      totalCandidates: 156,
      feedbacks: 23,
      activeJobs: 42
    });
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
      case 'approve': return 'Duyệt tin tuyển dụng';
      case 'candidates': return 'Xem hồ sơ ứng viên';
      case 'interview-invitations': return 'Xem lời mời phỏng vấn';
      case 'reports': return 'Báo cáo & Thống kê';
      default: return 'TalentHub Dashboard';
    }
  };

  const getTabDescription = () => {
    switch(tab) {
      case 'approve': return 'Duyệt và quản lý các tin tuyển dụng từ nhà tuyển dụng';
      case 'candidates': return 'Xem tổng quan và quản lý hồ sơ ứng viên trong hệ thống';
      case 'interview-invitations': return 'Xem lịch phỏng vấn và quản lý lịch hẹn';
      case 'reports': return 'Xem báo cáo và thống kê hoạt động của hệ thống';
      default: return 'Quản lý tổng thể hoạt động tuyển dụng';
    }
  };

  const renderContent = () => {
    switch(tab) {
      case 'approve': return <ApproveJobList />;
      case 'candidates': return <CandidateList2 />;
      case 'interview-invitations': return <InterviewInvitation2 />;
      case 'reports': return (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '48px',
            marginBottom: '16px'
          }}>
            📊
          </div>
          <h3 style={{color: '#4a5568', marginBottom: '16px'}}>Báo cáo & Thống kê</h3>
          <p style={{color: '#718096', marginBottom: '24px'}}>
            Tính năng đang được phát triển. Sẽ sớm ra mắt!
          </p>
        </div>
      );
      default: return <div>Content not found</div>;
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      backgroundColor: '#f8fafc'
    }}>
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
    <div>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
                TalentHub
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                Admin Panel
              </div>
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

        {/* Quick Stats */}
        {!sidebarCollapsed && (
          <div style={{
            padding: '16px',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '12px 8px',
                textAlign: 'center'
              }}>
                <div style={{color: 'white', fontSize: '18px', fontWeight: 'bold'}}>
                  {stats.pendingJobs}
                </div>
                <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '10px'}}>
                  Chờ duyệt
                </div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '12px 8px',
                textAlign: 'center'
              }}>
                <div style={{color: 'white', fontSize: '18px', fontWeight: 'bold'}}>
                  {stats.totalCandidates}
                </div>
                <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '10px'}}>
                  Ứng viên
                </div>
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '6px',
              padding: '8px',
              textAlign: 'center'
            }}>
              <span style={{color: 'white', fontSize: '12px', fontWeight: '500'}}>
                {stats.activeJobs} tin đang hoạt động
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '20px 0' }}>
          {[
            { key: 'approve', icon: '✅', label: 'Duyệt tin tuyển dụng', badge: stats.pendingJobs },
            { key: 'candidates', icon: '👥', label: 'Xem hồ sơ ứng viên' },
            { key: 'interview-invitations', icon: '📅', label: 'Xem lời mời phỏng vấn' },
            { key: 'reports', icon: '📊', label: 'Báo cáo & Thống kê' }
          ].map(item => (
            <div
              key={item.key}
              onClick={() => setTab(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
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
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: sidebarCollapsed ? '0' : '12px', fontSize: '16px' }}>
                  {item.icon}
                </span>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </div>
              {!sidebarCollapsed && item.badge && item.badge > 0 && (
                <span style={{
                  background: '#e53e3e',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '2px 6px',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* System Status */}
        {!sidebarCollapsed && (
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '12px'
            }}>
              <div style={{ color: 'white', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                Hệ thống
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#48bb78'
                }}></div>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>
                  Hoạt động bình thường
                </span>
              </div>
            </div>
            
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginBottom: '8px' }}>
              👋 {username}
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
              {getTabDescription()}
            </p>
          </div>

          {/* Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={{
                  background: '#f7fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                📤 Xuất báo cáo
              </button>
              <button
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                ⚙️ Cài đặt
              </button>
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
          </div>
        </header>

        {/* Overview Stats Bar */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 24px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '8px',
                padding: '8px',
                color: 'white'
              }}>
                📋
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d3748' }}>
                  {stats.pendingJobs}
                </div>
                <div style={{ fontSize: '12px', color: '#718096' }}>
                  Tin chờ duyệt
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                background: '#48bb78',
                borderRadius: '8px',
                padding: '8px',
                color: 'white'
              }}>
                👥
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d3748' }}>
                  {stats.totalCandidates}
                </div>
                <div style={{ fontSize: '12px', color: '#718096' }}>
                  Tổng ứng viên
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                background: '#ed8936',
                borderRadius: '8px',
                padding: '8px',
                color: 'white'
              }}>
                💼
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d3748' }}>
                  {stats.activeJobs}
                </div>
                <div style={{ fontSize: '12px', color: '#718096' }}>
                  Tin đang hoạt động
                </div>
              </div>
            </div>
          </div>
        </div>

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
            minHeight: 'calc(100vh - 200px)',
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
              width: '380px',
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
              <h6 style={{ margin: 0, fontWeight: '600' }}>Thông báo hệ thống</h6>
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

export default TalentHubDashboard; 