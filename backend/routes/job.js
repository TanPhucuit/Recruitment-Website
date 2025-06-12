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

// Lấy danh sách tin tuyển dụng
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT jobs.*, recruiters.company_name
      FROM jobs
      JOIN recruiters ON jobs.recruiter_id = recruiters.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Lấy tin tuyển dụng theo id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT jobs.*, recruiters.company_name
      FROM jobs
      JOIN recruiters ON jobs.recruiter_id = recruiters.id
      WHERE jobs.id = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy tin' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Tạo mới tin tuyển dụng (chỉ recruiter)
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ error: 'Chỉ nhà tuyển dụng được đăng tin' });
  const { branch_id, title, category_id, area, position, salary, job_type, requirement, benefit, posted_date, deadline, status, description } = req.body;
  try {
    // Lấy recruiter_id từ user_id
    const [recruiterRows] = await pool.query('SELECT id FROM recruiters WHERE user_id = ?', [req.user.id]);
    if (!recruiterRows.length) {
      return res.status(404).json({ error: 'Không tìm thấy recruiter' });
    }
    const recruiterId = recruiterRows[0].id;
    await pool.query(
      'INSERT INTO jobs (recruiter_id, branch_id, title, category_id, area, position, salary, job_type, requirement, benefit, posted_date, deadline, status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [recruiterId, branch_id, title, category_id, area, position, salary, job_type, requirement, benefit, posted_date, deadline, status, description]
    );
    res.json({ message: 'Đăng tin thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Cập nhật tin tuyển dụng (chỉ recruiter)
router.put('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ error: 'Chỉ nhà tuyển dụng được cập nhật tin' });
  const { branch_id, title, category_id, area, position, salary, job_type, requirement, benefit, posted_date, deadline, status, description } = req.body;
  try {
    // Lấy recruiter_id từ user_id
    const [recruiterRows] = await pool.query('SELECT id FROM recruiters WHERE user_id = ?', [req.user.id]);
    if (!recruiterRows.length) {
      console.log('❌ Không tìm thấy recruiter cho user_id:', req.user.id);
      return res.status(404).json({ error: 'Không tìm thấy recruiter' });
    }
    const recruiterId = recruiterRows[0].id;
    // Cập nhật job thuộc recruiter này
    const [result] = await pool.query(
      'UPDATE jobs SET branch_id=?, title=?, category_id=?, area=?, position=?, salary=?, job_type=?, requirement=?, benefit=?, posted_date=?, deadline=?, status=?, description=? WHERE id=? AND recruiter_id=?',
      [branch_id, title, category_id, area, position, salary, job_type, requirement, benefit, posted_date, deadline, status, description, req.params.id, recruiterId]
    );
    console.log('Update job result:', result);
    res.json({ message: 'Cập nhật tin thành công', affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Xóa tin tuyển dụng (chỉ recruiter)
router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ error: 'Chỉ nhà tuyển dụng được xóa tin' });
  try {
    // Lấy recruiter_id từ user_id
    const [recruiterRows] = await pool.query('SELECT id FROM recruiters WHERE user_id = ?', [req.user.id]);
    if (!recruiterRows.length) {
      console.log('❌ Không tìm thấy recruiter cho user_id:', req.user.id);
      return res.status(404).json({ error: 'Không tìm thấy recruiter' });
    }
    const recruiterId = recruiterRows[0].id;
    // Xóa job thuộc recruiter này
    const [result] = await pool.query('DELETE FROM jobs WHERE id = ? AND recruiter_id = ?', [req.params.id, recruiterId]);
    console.log('Delete job result:', result);
    res.json({ message: 'Xóa tin thành công', affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Lấy danh sách tin chờ duyệt (chỉ talenthub_staff)
router.get('/pending', authMiddleware, async (req, res) => {
  if (req.user.role !== 'talenthub_staff') return res.status(403).json({ error: 'Chỉ nhân viên TalentHub được xem tin chờ duyệt' });
  try {
    const [rows] = await pool.query('SELECT * FROM jobs WHERE status = "pending"');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Duyệt tin tuyển dụng (chỉ talenthub_staff)
router.put('/:id/approve', authMiddleware, async (req, res) => {
  if (req.user.role !== 'talenthub_staff') return res.status(403).json({ error: 'Chỉ nhân viên TalentHub được duyệt tin' });
  try {
    await pool.query('UPDATE jobs SET status = "active" WHERE id = ?', [req.params.id]);
    res.json({ message: 'Duyệt tin thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

module.exports = router;
