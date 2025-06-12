import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Navbar.css';

const NavigationBar = () => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        // TODO: Fetch notifications from API
        setNotifications([
          { id: 1, message: 'Có tin tuyển dụng mới phù hợp với bạn', time: '5 phút trước', read: false },
          { id: 2, message: 'Bài test của bạn đã được chấm điểm', time: '1 giờ trước', read: false },
          { id: 3, message: 'Lịch phỏng vấn đã được xác nhận', time: '2 giờ trước', read: true }
        ]);
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const getRoleText = (role) => {
    switch(role) {
      case 'candidate': return 'Ứng viên';
      case 'recruiter': return 'Nhà tuyển dụng';
      case 'talenthub_staff': return 'Nhân viên TalentHub';
      default: return 'Người dùng';
    }
  };

  const getDashboardLink = (role) => {
    switch(role) {
      case 'candidate': return '/candidate-dashboard';
      case 'recruiter': return '/recruiter-dashboard';
      case 'talenthub_staff': return '/talenthub-dashboard';
      default: return '/';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">TalentHub</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <>
                <Nav.Link as={Link} to={getDashboardLink(user.role)}>Trang chủ</Nav.Link>
                {user.role === 'candidate' && (
                  <Nav.Link as={Link} to="/jobs">Tìm việc</Nav.Link>
                )}
                {user.role === 'recruiter' && (
                  <Nav.Link as={Link} to="/post-job">Đăng tin</Nav.Link>
                )}
                {user.role === 'talenthub_staff' && (
                  <Nav.Link as={Link} to="/talenthub-dashboard?tab=approve">Duyệt tin</Nav.Link>
                )}
              </>
            )}
          </Nav>
          <Nav className="ms-auto">
            {!user ? (
              <>
                <Nav.Link as={Link} to="/login">Đăng nhập</Nav.Link>
                <Nav.Link as={Link} to="/register">Đăng ký</Nav.Link>
              </>
            ) : (
              <>
                <div className="notification-wrapper">
                  <button 
                    className="notification-btn"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <i className="bi bi-bell"></i>
                    {unreadCount > 0 && (
                      <Badge bg="danger" className="notification-badge">
                        {unreadCount}
                      </Badge>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="notification-dropdown">
                      <div className="notification-header">
                        <h6>Thông báo</h6>
                        <button className="mark-all-read">Đánh dấu đã đọc</button>
                      </div>
                      <div className="notification-list">
                        {notifications.length === 0 ? (
                          <div className="no-notifications">Không có thông báo mới</div>
                        ) : (
                          notifications.map(notification => (
                            <div 
                              key={notification.id} 
                              className={`notification-item ${!notification.read ? 'unread' : ''}`}
                            >
                              <div className="notification-content">
                                <div className="notification-message">{notification.message}</div>
                                <div className="notification-time">{notification.time}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="dark" id="dropdown-basic" className="user-dropdown">
                    <i className="bi bi-person-circle"></i>
                    <span className="username">{user.username || 'User'}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Header>
                      <div className="user-info">
                        <div className="user-name">{user.username}</div>
                        <div className="user-role">{getRoleText(user.role)}</div>
                      </div>
                    </Dropdown.Header>
                    <Dropdown.Item as={Link} to="/profile">
                      <i className="bi bi-person"></i> Hồ sơ
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/settings">
                      <i className="bi bi-gear"></i> Cài đặt
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right"></i> Đăng xuất
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
