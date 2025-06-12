const express = require('express');
const router = express.Router();
const pool = require('../config');
const jwt = require('jsonwebtoken');

// Middleware xác thực JWT
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

// Lấy danh sách CV ứng viên (chỉ cho admin hoặc talenthub)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM candidate_cv');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Lấy CV theo user_id (ứng viên xem hồ sơ của mình)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM candidate_cv WHERE user_id = ?', [req.user.id]);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Tạo mới CV
router.post('/', authMiddleware, async (req, res) => {
  const { fullname, birthdate, phone, email, address, education, certificates, experience, file_path } = req.body;
  try {
    await pool.query(
      'INSERT INTO candidate_cv (user_id, fullname, birthdate, phone, email, address, education, certificates, experience, file_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, fullname, birthdate, phone, email, address, education, certificates, experience, file_path]
    );
    res.json({ message: 'Tạo hồ sơ thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Cập nhật CV
router.put('/me', authMiddleware, async (req, res) => {
  const { fullname, birthdate, phone, email, address, education, certificates, experience, file_path } = req.body;
  try {
    await pool.query(
      'UPDATE candidate_cv SET fullname=?, birthdate=?, phone=?, email=?, address=?, education=?, certificates=?, experience=?, file_path=? WHERE user_id=?',
      [fullname, birthdate, phone, email, address, education, certificates, experience, file_path, req.user.id]
    );
    res.json({ message: 'Cập nhật hồ sơ thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Xóa CV
router.delete('/me', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM candidate_cv WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Xóa hồ sơ thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Cho phép recruiter xem hồ sơ ứng viên theo id
router.get('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'recruiter' && req.user.role !== 'talenthub_staff') {
    return res.status(403).json({ error: 'Không có quyền xem hồ sơ ứng viên' });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM candidate_cv WHERE id = ?', [req.params.id]);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

module.exports = router; 