const express = require('express');
const router = express.Router();
const pool = require('../config');
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Chưa đăng nhập' });
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Token không hợp lệ' });
    req.user = user;
    next();
  });
}

// Gửi thông báo (email, sms)
router.post('/', authMiddleware, async (req, res) => {
  if (!['talenthub_staff', 'recruiter'].includes(req.user.role)) return res.status(403).json({ error: 'Không có quyền gửi thông báo' });
  const { user_id, type, content } = req.body;
  try {
    await pool.query('INSERT INTO notifications (user_id, type, content) VALUES (?, ?, ?)', [user_id, type, content]);
    res.json({ message: 'Gửi thông báo thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

module.exports = router; 