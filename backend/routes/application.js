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

// Ứng viên nộp đơn ứng tuyển
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'candidate') return res.status(403).json({ error: 'Chỉ ứng viên được nộp đơn' });
  const { job_id } = req.body;
  try {
    // Lấy CV của ứng viên
    const [cvRows] = await pool.query('SELECT id FROM candidate_cv WHERE user_id = ?', [req.user.id]);
    if (cvRows.length === 0) return res.status(400).json({ error: 'Bạn chưa có hồ sơ' });
    const candidate_cv_id = cvRows[0].id;
    await pool.query('INSERT INTO applications (candidate_cv_id, job_id) VALUES (?, ?)', [candidate_cv_id, job_id]);
    res.json({ message: 'Nộp đơn thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Ứng viên xem đơn của mình
router.get('/my', authMiddleware, async (req, res) => {
  if (req.user.role !== 'candidate') return res.status(403).json({ error: 'Chỉ ứng viên được xem đơn của mình' });
  try {
    const [cvRows] = await pool.query('SELECT id FROM candidate_cv WHERE user_id = ?', [req.user.id]);
    if (cvRows.length === 0) return res.json([]);
    const candidate_cv_id = cvRows[0].id;
    const [apps] = await pool.query('SELECT * FROM applications WHERE candidate_cv_id = ?', [candidate_cv_id]);
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Nhà tuyển dụng xem đơn ứng tuyển vào job của mình
router.get('/job/:job_id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ error: 'Chỉ nhà tuyển dụng được xem đơn' });
  try {
    const [jobs] = await pool.query('SELECT * FROM jobs WHERE id = ? AND recruiter_id = ?', [req.params.job_id, req.user.id]);
    if (jobs.length === 0) return res.status(403).json({ error: 'Không có quyền xem đơn cho job này' });
    const [apps] = await pool.query('SELECT * FROM applications WHERE job_id = ?', [req.params.job_id]);
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Cập nhật trạng thái đơn ứng tuyển (nhà tuyển dụng)
router.put('/:id/status', authMiddleware, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ error: 'Chỉ nhà tuyển dụng được cập nhật trạng thái' });
  const { status } = req.body;
  try {
    // Kiểm tra quyền
    const [apps] = await pool.query('SELECT a.*, j.recruiter_id FROM applications a JOIN jobs j ON a.job_id = j.id WHERE a.id = ?', [req.params.id]);
    if (apps.length === 0 || apps[0].recruiter_id !== req.user.id) return res.status(403).json({ error: 'Không có quyền' });
    await pool.query('UPDATE applications SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Cập nhật trạng thái thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Lấy danh sách bài test cho các job đã ứng tuyển
router.get('/tests', authMiddleware, async (req, res) => {
  if (req.user.role !== 'candidate') return res.status(403).json({ error: 'Chỉ ứng viên được xem bài test' });
  try {
    // Lấy candidate_cv_id
    const [cvRows] = await pool.query('SELECT id FROM candidate_cv WHERE user_id = ?', [req.user.id]);
    if (cvRows.length === 0) return res.json([]);
    const candidate_cv_id = cvRows[0].id;
    // Lấy các job_id đã ứng tuyển
    const [apps] = await pool.query('SELECT job_id FROM applications WHERE candidate_cv_id = ?', [candidate_cv_id]);
    if (apps.length === 0) return res.json([]);
    const jobIds = apps.map(a => a.job_id);
    // Lấy các bài test cho các job đã ứng tuyển
    const [tests] = await pool.query('SELECT * FROM tests WHERE job_id IN (?)', [jobIds]);
    // Lấy kết quả test của ứng viên
    const testIds = tests.map(t => t.id);
    let testResults = [];
    if (testIds.length > 0) {
      [testResults] = await pool.query('SELECT * FROM test_results WHERE test_id IN (?) AND candidate_cv_id = ?', [testIds, candidate_cv_id]);
    }
    // Map testId -> result
    const resultMap = {};
    testResults.forEach(r => { resultMap[r.test_id] = r; });
    // Gắn trạng thái cho từng test
    const now = new Date();
    const testsWithStatus = tests.map(test => {
      let status = 'pending';
      let score = null;
      if (resultMap[test.id]) {
        status = 'completed';
        score = resultMap[test.id].score;
      }
      // Nếu có deadline, kiểm tra hết hạn
      if (test.deadline && new Date(test.deadline) < now) {
        status = status === 'completed' ? 'completed' : 'expired';
      }
      return { ...test, status, score };
    });
    res.json(testsWithStatus);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Lấy danh sách ứng viên đã ứng tuyển vào các job của recruiter (dùng cho dashboard recruiter)
router.get('/recruiter-candidates', authMiddleware, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ error: 'Chỉ nhà tuyển dụng được xem' });
  try {
    // Lấy recruiter_id từ user_id
    const [recruiterRows] = await pool.query('SELECT id FROM recruiters WHERE user_id = ?', [req.user.id]);
    if (!recruiterRows.length) return res.json([]);
    const recruiterId = recruiterRows[0].id;

    const [rows] = await pool.query(`
      SELECT 
        a.id AS application_id,
        c.id AS cv_id,
        c.fullname,
        c.phone,
        c.email,
        j.title AS job_title,
        (
          SELECT i.status
          FROM interviews i
          WHERE i.application_id = a.id
          ORDER BY i.id DESC
          LIMIT 1
        ) AS interview_status
      FROM applications a
      JOIN candidate_cv c ON a.candidate_cv_id = c.id
      JOIN jobs j ON a.job_id = j.id
      WHERE j.recruiter_id = ?
      GROUP BY a.id
    `, [recruiterId]);
    console.log('Recruiter candidates result:', rows);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Xóa đơn ứng tuyển (chỉ recruiter, chỉ xóa application thuộc job của mình)
router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ error: 'Chỉ nhà tuyển dụng được xóa đơn ứng tuyển' });
  try {
    // Lấy recruiter_id từ user_id
    const [recruiterRows] = await pool.query('SELECT id FROM recruiters WHERE user_id = ?', [req.user.id]);
    if (!recruiterRows.length) return res.status(404).json({ error: 'Không tìm thấy recruiter' });
    const recruiterId = recruiterRows[0].id;
    // Kiểm tra application có thuộc job của recruiter này không
    const [apps] = await pool.query('SELECT a.*, j.recruiter_id FROM applications a JOIN jobs j ON a.job_id = j.id WHERE a.id = ?', [req.params.id]);
    if (!apps.length || apps[0].recruiter_id !== recruiterId) return res.status(403).json({ error: 'Không có quyền xóa đơn này' });
    // Xóa application
    await pool.query('DELETE FROM applications WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa đơn ứng tuyển thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

module.exports = router; 