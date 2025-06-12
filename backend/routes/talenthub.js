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

// Lấy danh sách nhân viên TalentHub
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM talenthub_staff');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Thêm mới nhân viên TalentHub
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'talenthub_staff') return res.status(403).json({ error: 'Chỉ nhân viên TalentHub được thêm' });
  const { user_id, full_name, position } = req.body;
  try {
    await pool.query('INSERT INTO talenthub_staff (user_id, full_name, position) VALUES (?, ?, ?)', [user_id, full_name, position]);
    res.json({ message: 'Thêm nhân viên thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Cập nhật thông tin nhân viên
router.put('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'talenthub_staff') return res.status(403).json({ error: 'Chỉ nhân viên TalentHub được cập nhật' });
  const { full_name, position } = req.body;
  try {
    await pool.query('UPDATE talenthub_staff SET full_name=?, position=? WHERE id=?', [full_name, position, req.params.id]);
    res.json({ message: 'Cập nhật thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Xóa nhân viên TalentHub
router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'talenthub_staff') return res.status(403).json({ error: 'Chỉ nhân viên TalentHub được xóa' });
  try {
    await pool.query('DELETE FROM talenthub_staff WHERE id=?', [req.params.id]);
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Lấy danh sách hồ sơ ứng viên (chỉ talenthub_staff)
router.get('/candidates', authMiddleware, async (req, res) => {
  if (req.user.role !== 'talenthub_staff') return res.status(403).json({ error: 'Chỉ nhân viên TalentHub được xem' });
  try {
    const [rows] = await pool.query('SELECT * FROM candidate_cv');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Lấy chi tiết hồ sơ ứng viên theo id (chỉ talenthub_staff)
router.get('/candidate/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'talenthub_staff') return res.status(403).json({ error: 'Chỉ nhân viên TalentHub được xem' });
  try {
    const [rows] = await pool.query('SELECT * FROM candidate_cv WHERE id = ?', [req.params.id]);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

module.exports = router; 