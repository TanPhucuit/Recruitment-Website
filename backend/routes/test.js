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

// Lấy danh sách bài test
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tests');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Lấy bài test theo id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tests WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy test' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Tạo mới bài test (chỉ recruiter)
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ error: 'Chỉ nhà tuyển dụng được tạo test' });
  const { job_id, test_name } = req.body;
  try {
    await pool.query('INSERT INTO tests (job_id, test_name) VALUES (?, ?)', [job_id, test_name]);
    res.json({ message: 'Tạo test thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Thêm câu hỏi vào test (chỉ recruiter)
router.post('/:test_id/questions', authMiddleware, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ error: 'Chỉ nhà tuyển dụng được thêm câu hỏi' });
  const { question_text, answer_a, answer_b, answer_c, answer_d, correct_answer } = req.body;
  try {
    await pool.query('INSERT INTO questions (test_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.params.test_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer]);
    res.json({ message: 'Thêm câu hỏi thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Lấy danh sách câu hỏi theo test_id
router.get('/:test_id/questions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM questions WHERE test_id = ?', [req.params.test_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Nộp bài test
router.post('/:test_id/submit', authMiddleware, async (req, res) => {
  if (req.user.role !== 'candidate') return res.status(403).json({ error: 'Chỉ ứng viên được nộp bài test' });
  const { answers, score, total } = req.body;
  try {
    // Lấy candidate_cv_id
    const [cvRows] = await pool.query('SELECT id FROM candidate_cv WHERE user_id = ?', [req.user.id]);
    if (cvRows.length === 0) return res.status(400).json({ error: 'Bạn chưa có hồ sơ' });
    const candidate_cv_id = cvRows[0].id;
    // Kiểm tra đã nộp chưa
    const [exist] = await pool.query('SELECT * FROM test_results WHERE test_id = ? AND candidate_cv_id = ?', [req.params.test_id, candidate_cv_id]);
    if (exist.length > 0) return res.status(400).json({ error: 'Bạn đã nộp bài test này rồi' });
    await pool.query('INSERT INTO test_results (test_id, candidate_cv_id, score) VALUES (?, ?, ?)', [req.params.test_id, candidate_cv_id, score]);
    res.json({ message: 'Nộp bài thành công', score, total });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Cập nhật bài test (chỉ recruiter)
router.put('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ error: 'Chỉ nhà tuyển dụng được cập nhật test' });
  const { test_name, job_id, duration, deadline } = req.body;
  try {
    await pool.query('UPDATE tests SET test_name = ?, job_id = ?, duration = ?, deadline = ? WHERE id = ?', [test_name, job_id, duration, deadline, req.params.id]);
    res.json({ message: 'Cập nhật bài test thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Xóa bài test (chỉ recruiter)
router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ error: 'Chỉ nhà tuyển dụng được xóa test' });
  try {
    const [result] = await pool.query('DELETE FROM tests WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy bài test để xóa' });
    res.json({ message: 'Xóa bài test thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

module.exports = router; 