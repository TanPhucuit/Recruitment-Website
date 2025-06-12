const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../config');

// Đăng ký
router.post('/register', async (req, res) => {
  const { username, password, email, phone, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }
  try {
    const [userCheck] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (userCheck.length > 0) {
      return res.status(409).json({ error: 'Tên đăng nhập đã tồn tại' });
    }
    // Lưu password dạng plain text
    await pool.query('INSERT INTO users (username, password, email, phone, role) VALUES (?, ?, ?, ?, ?)', [username, password, email, phone, role]);
    res.json({ message: 'Đăng ký thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Thiếu thông tin đăng nhập' });
  }
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
    const user = users[0];
    // So sánh password plain text
    if (user.password !== password) {
      return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
    
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Lấy thông tin user hiện tại
router.get('/me', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Chưa đăng nhập' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const [users] = await pool.query('SELECT id, username, email, role FROM users WHERE id = ?', [decoded.id]);
    if (users.length === 0) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    res.json(users[0]);
  } catch (err) {
    res.status(403).json({ error: 'Token không hợp lệ', detail: err.message });
  }
});

// Đổi mật khẩu
router.post('/reset-password', async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }
    const user = users[0];
    if (user.password !== oldPassword) {
      return res.status(401).json({ error: 'Mật khẩu cũ không đúng' });
    }
    if (oldPassword === newPassword) {
      return res.status(400).json({ error: 'Mật khẩu mới phải khác mật khẩu cũ' });
    }
    await pool.query('UPDATE users SET password = ? WHERE username = ?', [newPassword, username]);
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

module.exports = router; 