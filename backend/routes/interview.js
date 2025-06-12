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

console.log('🚀 Interview routes loaded');

// Nhà tuyển dụng tạo lịch phỏng vấn
router.post('/', authMiddleware, async (req, res) => {
  console.log('--- [POST /api/interviews] ---');
  console.log('req.user:', req.user);
  console.log('body:', req.body);
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ error: 'Chỉ nhà tuyển dụng được tạo lịch' });
  }
  const { application_id, interview_date, location } = req.body;
  
  // Validate input
  if (!application_id || !interview_date || !location) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }
  
  try {
    // Lấy recruiter_id từ user_id
    const [recruiterRows] = await pool.query('SELECT id FROM recruiters WHERE user_id = ?', [req.user.id]);
    if (!recruiterRows.length) {
      console.log('❌ Không tìm thấy recruiter cho user_id:', req.user.id);
      return res.status(404).json({ error: 'Không tìm thấy recruiter' });
    }
    const recruiterId = recruiterRows[0].id;
    // Kiểm tra application có thuộc về recruiter này không
    const [applicationCheck] = await pool.query(`
      SELECT a.*, j.recruiter_id, j.title as job_title 
      FROM applications a 
      JOIN jobs j ON a.job_id = j.id 
      WHERE a.id = ? AND j.recruiter_id = ?
    `, [application_id, recruiterId]);
    console.log('applicationCheck:', applicationCheck);
    if (applicationCheck.length === 0) {
      console.log('❌ Không tìm thấy đơn ứng tuyển hoặc recruiter không sở hữu job này!');
      return res.status(404).json({ error: 'Không tìm thấy đơn ứng tuyển hoặc bạn không có quyền' });
    }
    
    // Tạo lịch phỏng vấn mới
    const [result] = await pool.query(
      'INSERT INTO interviews (application_id, interview_date, location, status) VALUES (?, ?, ?, ?)',
      [application_id, interview_date, location, 'scheduled']
    );
    
    // Cập nhật trạng thái đơn ứng tuyển
    await pool.query(
      'UPDATE applications SET status = ? WHERE id = ?',
      ['interviewed', application_id]
    );
    
    // Lấy thông tin ứng viên để gửi thông báo (optional)
    const [candidateInfo] = await pool.query(`
      SELECT c.fullname, c.email, u.id as user_id
      FROM applications a
      JOIN candidate_cv c ON a.candidate_cv_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE a.id = ?
    `, [application_id]);
    
    res.json({ 
      message: 'Tạo lịch phỏng vấn thành công',
      interview_id: result.insertId,
      candidate_name: candidateInfo[0]?.fullname || 'N/A'
    });
    
  } catch (err) {
    console.error('Error creating interview:', err);
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Ứng viên xem lịch phỏng vấn của mình (với thông tin đầy đủ)
router.get('/my', authMiddleware, async (req, res) => {
  if (req.user.role !== 'candidate') {
    return res.status(403).json({ error: 'Chỉ ứng viên được xem lịch phỏng vấn' });
  }
  
  try {
    console.log('Getting interviews for user:', req.user.id);
    
    // Lấy candidate_cv_id của user
    const [cvRows] = await pool.query('SELECT id FROM candidate_cv WHERE user_id = ?', [req.user.id]);
    console.log('CV rows:', cvRows);
    
    if (cvRows.length === 0) {
      return res.json([]);
    }
    
    const candidate_cv_id = cvRows[0].id;
    
    // Lấy tất cả applications của ứng viên này
    const [apps] = await pool.query(
      'SELECT id, job_id FROM applications WHERE candidate_cv_id = ?', 
      [candidate_cv_id]
    );
    console.log('Applications:', apps);
    
    if (apps.length === 0) {
      return res.json([]);
    }
    
    const appIds = apps.map(a => a.id);
    
    // Lấy interviews với thông tin đầy đủ, loại bỏ bản ghi lặp
    const placeholders = appIds.map(() => '?').join(',');
    const [interviews] = await pool.query(`
      SELECT DISTINCT i.id, i.interview_date, i.location, i.status,
        j.title as job_title, j.position, r.company_name as recruiter_company
      FROM interviews i
      JOIN applications a ON i.application_id = a.id
      JOIN jobs j ON a.job_id = j.id
      JOIN recruiters r ON j.recruiter_id = r.id
      WHERE i.application_id IN (${placeholders})
      ORDER BY i.interview_date DESC
    `, appIds);
    
    console.log('Final interviews:', interviews);
    res.json(interviews);
    
  } catch (err) {
    console.error('Error in /api/interviews/my:', err);
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Cập nhật trạng thái phỏng vấn
router.put('/:id/status', authMiddleware, async (req, res) => {
  const { status } = req.body;
  const interviewId = req.params.id;
  
  // Validate status
  const validStatuses = ['scheduled', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
  }
  
  try {
    // Lấy thông tin phỏng vấn
    const [interviewInfo] = await pool.query(`
      SELECT 
        i.*,
        a.candidate_cv_id,
        j.recruiter_id,
        c.user_id as candidate_user_id
      FROM interviews i
      JOIN applications a ON i.application_id = a.id
      JOIN jobs j ON a.job_id = j.id
      JOIN candidate_cv c ON a.candidate_cv_id = c.id
      WHERE i.id = ?
    `, [interviewId]);
    
    if (interviewInfo.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy lịch phỏng vấn' });
    }
    
    const interview = interviewInfo[0];
    
    // Kiểm tra quyền
    if (req.user.role === 'recruiter') {
      // Recruiter chỉ có thể cập nhật interview của mình
      if (interview.recruiter_id !== req.user.id) {
        return res.status(403).json({ error: 'Không có quyền cập nhật lịch phỏng vấn này' });
      }
    } else if (req.user.role === 'candidate') {
      // Candidate chỉ có thể cập nhật interview của mình và chỉ với trạng thái completed/cancelled
      if (interview.candidate_user_id !== req.user.id) {
        return res.status(403).json({ error: 'Không có quyền cập nhật lịch phỏng vấn này' });
      }
      if (!['completed', 'cancelled'].includes(status)) {
        return res.status(403).json({ error: 'Ứng viên chỉ có thể chấp nhận hoặc từ chối phỏng vấn' });
      }
    } else {
      return res.status(403).json({ error: 'Không có quyền cập nhật trạng thái' });
    }
    
    // Cập nhật trạng thái
    await pool.query('UPDATE interviews SET status = ? WHERE id = ?', [status, interviewId]);
    
    // Nếu candidate chấp nhận (completed), cập nhật application status
    if (req.user.role === 'candidate' && status === 'completed') {
      await pool.query(
        'UPDATE applications SET status = ? WHERE id = ?',
        ['interviewed', interview.application_id]
      );
    }
    
    res.json({ 
      message: 'Cập nhật trạng thái thành công',
      interview_id: interviewId,
      new_status: status,
      updated_by: req.user.role
    });
    
  } catch (err) {
    console.error('Error updating interview status:', err);
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Thêm feedback sau phỏng vấn
router.post('/:id/feedback', authMiddleware, async (req, res) => {
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ error: 'Chỉ nhà tuyển dụng được đánh giá' });
  }
  
  const { interviewer_name, feedback } = req.body;
  const interviewId = req.params.id;
  
  if (!interviewer_name || !feedback) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }
  
  try {
    // Kiểm tra interview có thuộc về recruiter này không
    const [interviewCheck] = await pool.query(`
      SELECT i.id
      FROM interviews i
      JOIN applications a ON i.application_id = a.id
      JOIN jobs j ON a.job_id = j.id
      WHERE i.id = ? AND j.recruiter_id = ?
    `, [interviewId, req.user.id]);
    
    if (interviewCheck.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy lịch phỏng vấn hoặc bạn không có quyền' });
    }
    
    await pool.query(
      'INSERT INTO interview_feedback (interview_id, interviewer_name, feedback) VALUES (?, ?, ?)',
      [interviewId, interviewer_name, feedback]
    );
    
    res.json({ message: 'Đánh giá thành công' });
    
  } catch (err) {
    console.error('Error adding feedback:', err);
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// Nhà tuyển dụng xem các lịch phỏng vấn đã gửi
router.get('/sent', authMiddleware, async (req, res) => {
  console.log('🔥 /api/interviews/sent called');
  console.log('👤 User:', req.user);
  if (req.user.role !== 'recruiter') {
    console.log('❌ Access denied - not recruiter');
    return res.status(403).json({ error: 'Chỉ nhà tuyển dụng được xem' });
  }
  try {
    // Lấy recruiter_id từ bảng recruiters dựa vào user_id
    const [recruiterRows] = await pool.query('SELECT id FROM recruiters WHERE user_id = ?', [req.user.id]);
    if (!recruiterRows.length) {
      console.log('❌ No recruiter found for user_id:', req.user.id);
      return res.json([]);
    }
    const recruiterId = recruiterRows[0].id;
    console.log('🔍 Querying for recruiter_id:', recruiterId);
    const [interviews] = await pool.query(`
      SELECT DISTINCT i.id, i.interview_date, i.location, i.status,
        a.candidate_cv_id, c.fullname as candidate_name, j.title as job_title, j.position
      FROM interviews i
      JOIN applications a ON i.application_id = a.id
      JOIN candidate_cv c ON a.candidate_cv_id = c.id
      JOIN jobs j ON a.job_id = j.id
      WHERE j.recruiter_id = ?
      ORDER BY i.interview_date DESC
    `, [recruiterId]);
    console.log('✅ Found interviews:', interviews.length);
    console.log('📊 Interview data:', interviews);
    res.json(interviews);
  } catch (err) {
    console.error('💥 Database error:', err);
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// API mới: Lấy trạng thái phỏng vấn realtime
router.get('/status/:id', authMiddleware, async (req, res) => {
  const interviewId = req.params.id;
  
  try {
    const [interview] = await pool.query(`
      SELECT 
        i.id,
        i.status,
        i.interview_date,
        i.location,
        c.fullname as candidate_name,
        j.title as job_title
      FROM interviews i
      JOIN applications a ON i.application_id = a.id
      JOIN candidate_cv c ON a.candidate_cv_id = c.id
      JOIN jobs j ON a.job_id = j.id
      WHERE i.id = ?
    `, [interviewId]);
    
    if (interview.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy lịch phỏng vấn' });
    }
    
    res.json(interview[0]);
    
  } catch (err) {
    console.error('Error getting interview status:', err);
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

// TalentHub staff xem tất cả lịch phỏng vấn
router.get('/all', authMiddleware, async (req, res) => {
  if (req.user.role !== 'talenthub_staff') {
    return res.status(403).json({ error: 'Chỉ nhân viên TalentHub được xem tất cả lịch phỏng vấn' });
  }
  try {
    const [rows] = await pool.query(`
      SELECT i.id, i.interview_date, i.location, i.status,
        c.fullname as candidate_name, j.title as job_title, j.position
      FROM interviews i
      JOIN applications a ON i.application_id = a.id
      JOIN candidate_cv c ON a.candidate_cv_id = c.id
      JOIN jobs j ON a.job_id = j.id
      ORDER BY i.interview_date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});

module.exports = router; 