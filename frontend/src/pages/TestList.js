import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TestList.css';
import { showSuccess, showError, showApiError } from '../utils/notificationUtils';
import { validateForm } from '../utils/validationUtils';
import ErrorBoundary from '../utils/errorBoundary';

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ test_name: '', job_id: '', duration: 60, deadline: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionData, setQuestionData] = useState({ 
    question_text: '', 
    answer_a: '', 
    answer_b: '', 
    answer_c: '', 
    answer_d: '', 
    correct_answer: 'A' 
  });
  const [editQuestion, setEditQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const styles = {
    container: {
      width: '100%',
      backgroundColor: '#f8fafc',
      minHeight: '100%',
      padding: '24px'
    },
    header: {
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e2e8f0'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1a202c',
      marginBottom: '8px',
      margin: 0
    },
    subtitle: {
      color: '#718096',
      fontSize: '14px',
      marginBottom: '20px',
      margin: '8px 0 20px 0'
    },
    addButton: {
      backgroundColor: '#38a169',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '20px'
    },
    tableContainer: {
      width: '100%',
      overflowX: 'auto',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }
  };

  const fetchTests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/api/tests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTests(res.data);
    } catch (err) {
      console.error('Error fetching tests:', err);
      setTests([
        {
          id: 1,
          test_name: 'JavaScript Fundamentals',
          job_title: 'Frontend Developer',
          duration: 60,
          total_questions: 20,
          created_at: '2024-06-01T10:00:00Z',
          deadline: '2024-06-15T23:59:59Z',
          status: 'active'
        },
        {
          id: 2,
          test_name: 'React Advanced',
          job_title: 'React Developer',
          duration: 90,
          total_questions: 25,
          created_at: '2024-06-02T14:30:00Z',
          deadline: '2024-06-20T23:59:59Z',
          status: 'draft'
        },
        {
          id: 3,
          test_name: 'Node.js Backend',
          job_title: 'Backend Developer',
          duration: 120,
          total_questions: 30,
          created_at: '2024-06-03T09:15:00Z',
          deadline: '2024-06-25T23:59:59Z',
          status: 'active'
        }
      ]);
    }
  };

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/api/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setJobs([]);
    }
  };

  useEffect(() => {
    fetchTests();
    fetchJobs();
  }, []);

  const handleDelete = (id) => {
    setSelectedId(id);
    setShowPopup(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/tests/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSuccess('Xóa bài test thành công');
      fetchTests();
    } catch (err) {
      showApiError(err);
      setTests(tests.filter(t => t.id !== selectedId));
    }
    setShowPopup(false);
    setSelectedId(null);
  };

  const handleAdd = () => {
    setFormData({ test_name: '', job_id: '', duration: 60, deadline: '' });
    setIsEdit(false);
    setShowForm(true);
    setQuestions([]);
  };

  const handleEdit = (test) => {
    setFormData({ ...test, deadline: test.deadline ? test.deadline.split('T')[0] : '' });
    setIsEdit(true);
    setShowForm(true);
    setSelectedTest(test);
    fetchQuestions(test.id);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const validationRules = {
      test_name: { required: true },
      job_id: { required: true },
      duration: { required: true },
      deadline: { required: true }
    };
    // Nếu job_id là object (do select), lấy id
    let submitData = { ...formData };
    if (typeof submitData.job_id === 'object' && submitData.job_id !== null) {
      submitData.job_id = submitData.job_id.id || '';
    }
    const errors = validateForm(submitData, validationRules);
    if (Object.keys(errors).length > 0) {
      let msg = 'Vui lòng kiểm tra lại thông tin:';
      if (errors.test_name) msg += '\n- Tên bài test';
      if (errors.job_id) msg += '\n- Vị trí tuyển dụng';
      if (errors.duration) msg += '\n- Thời gian làm bài';
      if (errors.deadline) msg += '\n- Hạn chót';
      showError(msg);
      return;
    }
    try {
      if (isEdit) {
        await axios.put(`http://localhost:3001/api/tests/${formData.id}`, submitData, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        showSuccess('Cập nhật bài test thành công');
      } else {
        await axios.post('http://localhost:3001/api/tests', submitData, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        showSuccess('Thêm bài test thành công');
      }
      setShowForm(false);
      fetchTests();
    } catch (err) {
      showApiError(err);
      setShowForm(false);
    }
  };

  const fetchQuestions = async (testId) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/tests/${testId}/questions`);
      setQuestions(res.data);
    } catch (err) {
      showApiError(err);
      setQuestions([]);
    }
  };

  const handleAddQuestion = () => {
    setQuestionData({ 
      question_text: '', 
      answer_a: '', 
      answer_b: '', 
      answer_c: '', 
      answer_d: '', 
      correct_answer: 'A' 
    });
    setEditQuestion(null);
    setShowQuestionForm(true);
  };

  const handleEditQuestion = (q) => {
    setQuestionData({ ...q });
    setEditQuestion(q);
    setShowQuestionForm(true);
  };

  const handleQuestionChange = (e) => {
    setQuestionData({ ...questionData, [e.target.name]: e.target.value });
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const validationRules = {
      question_text: { required: true },
      answer_a: { required: true },
      answer_b: { required: true },
      answer_c: { required: true },
      answer_d: { required: true },
      correct_answer: { required: true }
    };
    const errors = validateForm(questionData, validationRules);
    if (Object.keys(errors).length > 0) {
      showError('Vui lòng kiểm tra lại thông tin câu hỏi và đáp án');
      return;
    }
    try {
      if (editQuestion) {
        // Sửa câu hỏi (cần API riêng nếu có)
      } else {
        await axios.post(`http://localhost:3001/api/tests/${selectedTest.id}/questions`, questionData, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        showSuccess('Thêm câu hỏi thành công');
      }
      setShowQuestionForm(false);
      fetchQuestions(selectedTest.id);
    } catch (err) {
      showApiError(err);
      if (editQuestion) {
        setQuestions(questions.map(q => q.id === editQuestion.id ? { ...questionData } : q));
      } else {
        const newQuestion = { ...questionData, id: Date.now() };
        setQuestions([...questions, newQuestion]);
      }
      setShowQuestionForm(false);
    }
  };

  // Enhanced date formatting
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}p` : `${hours} giờ`;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'active': { bg: '#c6f6d5', color: '#22543d' },
      'draft': { bg: '#fed7d7', color: '#822727' },
      'expired': { bg: '#fbb6ce', color: '#702459' }
    };
    return colorMap[status] || { bg: '#e2e8f0', color: '#4a5568' };
  };

  const getStatusText = (status) => {
    const statusMap = {
      'active': 'Đang hoạt động',
      'draft': 'Nháp',
      'expired': 'Hết hạn'
    };
    return statusMap[status] || status;
  };

  // Pagination
  const totalPages = Math.ceil(tests.length / itemsPerPage);
  const paginatedTests = tests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <ErrorBoundary>
      <div className="test-list" style={styles.container}>
      {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Quản lý bài test</h1>
          <p style={styles.subtitle}>
            Tạo và quản lý các bài kiểm tra năng lực cho ứng viên
          </p>
          <button style={styles.addButton} onClick={handleAdd}>
            ➕ Tạo bài test mới
          </button>
      </div>
      {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{fontSize: '24px', fontWeight: '700', color: '#3182ce'}}>
              {tests.length}
            </div>
            <div style={{fontSize: '14px', color: '#718096'}}>Tổng số bài test</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{fontSize: '24px', fontWeight: '700', color: '#38a169'}}>
              {tests.filter(t => t.status === 'active').length}
            </div>
            <div style={{fontSize: '14px', color: '#718096'}}>Đang hoạt động</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{fontSize: '24px', fontWeight: '700', color: '#e53e3e'}}>
              {tests.filter(t => t.status === 'draft').length}
        </div>
            <div style={{fontSize: '14px', color: '#718096'}}>Bản nháp</div>
        </div>
      </div>
      {/* Table */}
        <div className="table-wrapper" style={styles.tableContainer}>
          <div style={{
            background:'#fff',
            borderRadius:12,
            boxShadow:'0 2px 8px rgba(0,0,0,0.06)',
            overflow:'hidden',
            width:'100%',
            minWidth: '800px'
          }}>
            <table className="test-table" style={{
              fontSize:'15px', 
              width: '100%', 
              tableLayout:'fixed',
              borderCollapse:'collapse', 
              borderSpacing:0,
              minWidth: '800px'
            }}>
            <thead>
              <tr style={{background:'#f7fafc',fontWeight:500}}>
                  <th style={{padding:'12px',textAlign:'left',fontWeight:'600',color:'#4a5568'}}>Tên bài test</th>
                  <th style={{padding:'12px',textAlign:'left',fontWeight:'600',color:'#4a5568'}}>Vị trí tuyển dụng</th>
                  <th style={{padding:'12px',textAlign:'left',fontWeight:'600',color:'#4a5568'}}>Thời gian làm bài</th>
                  <th style={{padding:'12px',textAlign:'left',fontWeight:'600',color:'#4a5568'}}>Số câu hỏi</th>
                  <th style={{padding:'12px',textAlign:'left',fontWeight:'600',color:'#4a5568'}}>Ngày tạo</th>
                  <th style={{padding:'12px',textAlign:'left',fontWeight:'600',color:'#4a5568'}}>Hạn chót</th>
                  <th style={{padding:'12px',textAlign:'left',fontWeight:'600',color:'#4a5568'}}>Trạng thái</th>
                  <th style={{padding:'12px',textAlign:'left',fontWeight:'600',color:'#4a5568'}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTests.map((test) => {
                const statusColors = getStatusColor(test.status);
                return (
                  <tr key={test.id} style={{fontWeight:400,borderBottom:'1px solid #f0f0f0'}}>
                      <td style={{padding:'12px',fontWeight: '600', color: '#2d3748'}}>{test.test_name}</td>
                      <td style={{padding:'12px'}}>
                        <span style={{
                          backgroundColor: '#edf2f7', 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '12px', 
                          color: '#4a5568'
                        }}>
                          {test.job_title}
                        </span>
                      </td>
                      <td style={{padding:'12px'}}>⏱️ {formatDuration(test.duration)}</td>
                      <td style={{padding:'12px',textAlign: 'center'}}>
                        <span style={{
                          backgroundColor: '#e6fffa', 
                          color: '#234e52', 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px', 
                          fontWeight: '600'
                        }}>
                          {test.total_questions || 0} câu
                        </span>
                      </td>
                      <td style={{padding:'12px'}}>📅 {formatDateTime(test.created_at)}</td>
                      <td style={{padding:'12px'}}>⏰ {formatDateTime(test.deadline)}</td>
                      <td style={{padding:'12px'}}>
                        <span style={{
                          background: statusColors.bg, 
                          color: statusColors.color, 
                          padding: '4px 12px', 
                          borderRadius: '12px', 
                          fontSize: '12px', 
                          fontWeight: 500
                        }}>
                          {getStatusText(test.status)}
                        </span>
                      </td>
                      <td style={{padding:'12px', minWidth: 160, whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset'}}>
                        <button 
                          style={{
                            backgroundColor: '#3182ce',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            marginRight: '8px',
                            display: 'inline-block',
                            pointerEvents: 'auto',
                            position: 'relative',
                            zIndex: 2,
                          }}
                          onClick={() => handleEdit(test)}
                        >
                          ✏️ Sửa
                        </button>
                        <button 
                          style={{
                            backgroundColor: '#e53e3e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'inline-block',
                            pointerEvents: 'auto',
                            position: 'relative',
                            zIndex: 3,
                          }}
                          onClick={() => handleDelete(test.id)}
                        >
                          🗑️ Xóa
                        </button>
                      </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '20px'
          }}>
            <button 
              style={{
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                opacity: currentPage === 1 ? 0.5 : 1
              }}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
            >
              ← Trước
            </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: currentPage === i + 1 ? '#3182ce' : 'white',
                  color: currentPage === i + 1 ? 'white' : '#4a5568',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
            <button 
              style={{
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages}
            >
              Tiếp →
            </button>
        </div>
      )}
      {showPopup && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%'
            }}>
              <h3 style={{marginTop: 0, color: '#e53e3e'}}>Xác nhận xóa</h3>
              <p>Bạn có chắc chắn muốn xóa bài test này?</p>
              <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
                <button 
                  style={{
                    backgroundColor: '#e53e3e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 20px',
                    cursor: 'pointer'
                  }}
                  onClick={confirmDelete}
                >
                  Xác nhận
                </button>
                <button 
                  style={{
                    backgroundColor: '#e2e8f0',
                    color: '#4a5568',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 20px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowPopup(false)}
                >
                  Hủy
                </button>
            </div>
          </div>
        </div>
      )}
      {showForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
            <form onSubmit={handleFormSubmit}>
                <h2 style={{marginTop: 0}}>{isEdit ? 'Sửa bài test' : 'Thêm bài test'}</h2>
                <div style={{marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '500'}}>
                    Tên bài test
                  </label>
                  <input 
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    name="test_name" 
                    value={formData.test_name} 
                    onChange={handleFormChange} 
                    required 
                  />
              </div>
                <div style={{marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '500'}}>
                    Vị trí tuyển dụng
                  </label>
                  <select
                    name="job_id"
                    value={formData.job_id}
                    onChange={handleFormChange}
                    required
                    style={{width:'100%',padding:'10px 12px',border:'1px solid #e2e8f0',borderRadius:'6px',fontSize:'14px'}}
                  >
                    <option value="">Chọn vị trí</option>
                    {jobs.map(job => (
                      <option key={job.id} value={job.id}>{job.title}</option>
                    ))}
                  </select>
              </div>
                <div style={{marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '500'}}>
                    Thời gian làm bài (phút)
                  </label>
                  <input 
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    name="duration" 
                    type="number" 
                    value={formData.duration} 
                    onChange={handleFormChange} 
                    required 
                  />
              </div>
                <div style={{marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '500'}}>
                    Hạn chót
                  </label>
                  <input 
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    name="deadline" 
                    type="datetime-local" 
                    value={formData.deadline} 
                    onChange={handleFormChange} 
                    required 
                  />
              </div>
                <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
                  <button 
                    style={{
                      backgroundColor: '#3182ce',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px 20px',
                      cursor: 'pointer'
                    }}
                    type="submit"
                  >
                    {isEdit ? 'Lưu thay đổi' : 'Thêm mới'}
                  </button>
                  <button 
                    style={{
                      backgroundColor: '#e2e8f0',
                      color: '#4a5568',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px 20px',
                      cursor: 'pointer'
                    }}
                    type="button" 
                    onClick={() => setShowForm(false)}
                  >
                    Hủy
                  </button>
              </div>
            </form>

              {/* Questions Management */}
            {isEdit && (
                <div style={{marginTop: 24, maxHeight: '300px', overflowY: 'auto'}}>
                <h3>Danh sách câu hỏi</h3>
                  <button 
                    style={{
                      backgroundColor: '#38a169',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      marginBottom: '16px'
                    }}
                    onClick={handleAddQuestion}
                  >
                    + Thêm câu hỏi
                  </button>
                  <ul style={{listStyle: 'none', padding: 0}}>
                  {questions.map(q => (
                      <li key={q.id} style={{
                        padding: '12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        marginBottom: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span>{q.question_text}</span>
                        <button 
                          style={{
                            backgroundColor: '#3182ce',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                          onClick={() => handleEditQuestion(q)}
                        >
                          Sửa
                        </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      {showQuestionForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
            <form onSubmit={handleQuestionSubmit}>
                <h2 style={{marginTop: 0}}>{editQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}</h2>
                <div style={{marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '500'}}>
                    Nội dung câu hỏi
                  </label>
                  <textarea 
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      minHeight: '80px'
                    }}
                    name="question_text" 
                    value={questionData.question_text} 
                    onChange={handleQuestionChange} 
                    required 
                  />
              </div>
                <div style={{marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '500'}}>
                    Đáp án A
                  </label>
                  <input 
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    name="answer_a" 
                    value={questionData.answer_a} 
                    onChange={handleQuestionChange} 
                    required 
                  />
              </div>
                <div style={{marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '500'}}>
                    Đáp án B
                  </label>
                  <input 
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    name="answer_b" 
                    value={questionData.answer_b} 
                    onChange={handleQuestionChange} 
                    required 
                  />
              </div>
                <div style={{marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '500'}}>
                    Đáp án C
                  </label>
                  <input 
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    name="answer_c" 
                    value={questionData.answer_c} 
                    onChange={handleQuestionChange} 
                    required 
                  />
              </div>
                <div style={{marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '500'}}>
                    Đáp án D
                  </label>
                  <input 
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    name="answer_d" 
                    value={questionData.answer_d} 
                    onChange={handleQuestionChange} 
                    required 
                  />
              </div>
                <div style={{marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '500'}}>
                    Đáp án đúng
                  </label>
                  <select 
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    name="correct_answer" 
                    value={questionData.correct_answer} 
                    onChange={handleQuestionChange}
                  >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
                <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
                  <button 
                    style={{
                      backgroundColor: '#3182ce',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px 20px',
                      cursor: 'pointer'
                    }}
                    type="submit"
                  >
                    {editQuestion ? 'Lưu thay đổi' : 'Thêm mới'}
                  </button>
                  <button 
                    style={{
                      backgroundColor: '#e2e8f0',
                      color: '#4a5568',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px 20px',
                      cursor: 'pointer'
                    }}
                    type="button" 
                    onClick={() => setShowQuestionForm(false)}
                  >
                    Hủy
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </ErrorBoundary>
  );
};

export default TestList; 