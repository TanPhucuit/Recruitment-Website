import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Applications.css';
import TestTaking from './TestTaking';

const Applications = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [doingTest, setDoingTest] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [testStarted, setTestStarted] = useState(false);

  const styles = {
    container: {
      width: '100%',
      backgroundColor: '#f8fafc',
      minHeight: '100%'
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
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    subtitle: {
      color: '#718096',
      fontSize: '14px',
      margin: '8px 0 0 0'
    },
    testsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    },
    testCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease',
      border: '1px solid #e2e8f0'
    },
    testCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 12px rgba(0, 0, 0, 0.1)'
    },
    testHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    testTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '4px'
    },
    testCompany: {
      fontSize: '14px',
      color: '#667eea',
      fontWeight: '500'
    },
    statusBadge: {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      textTransform: 'uppercase'
    },
    statusPending: {
      background: '#fff3cd',
      color: '#856404'
    },
    statusCompleted: {
      background: '#d1ecf1',
      color: '#0c5460'
    },
    statusExpired: {
      background: '#f8d7da',
      color: '#721c24'
    },
    testDetails: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginBottom: '16px'
    },
    testDetail: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      color: '#718096'
    },
    testActions: {
      display: 'flex',
      gap: '12px',
      marginTop: '16px'
    },
    startButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
      flex: 1
    },
    completedButton: {
      background: '#e2e8f0',
      color: '#4a5568',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'not-allowed',
      flex: 1
    },
    viewResultButton: {
      background: 'transparent',
      color: '#667eea',
      border: '1px solid #667eea',
      borderRadius: '8px',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    testInterface: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden'
    },
    testInterfaceHeader: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '24px',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    testInterfaceTitle: {
      fontSize: '20px',
      fontWeight: '600',
      margin: 0
    },
    timer: {
      background: 'rgba(255,255,255,0.2)',
      padding: '8px 16px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px'
    },
    progressBar: {
      background: 'rgba(255,255,255,0.2)',
      height: '6px',
      borderRadius: '3px',
      overflow: 'hidden',
      marginTop: '16px'
    },
    progressFill: {
      background: 'white',
      height: '100%',
      borderRadius: '3px',
      transition: 'width 0.3s ease'
    },
    questionContainer: {
      padding: '32px'
    },
    questionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e2e8f0'
    },
    questionNumber: {
      fontSize: '14px',
      color: '#718096',
      fontWeight: '500'
    },
    questionText: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#2d3748',
      lineHeight: '1.5',
      marginBottom: '24px'
    },
    answersContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '32px'
    },
    answerOption: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: 'white'
    },
    answerOptionSelected: {
      borderColor: '#667eea',
      background: '#f0f9ff'
    },
    answerOptionHover: {
      borderColor: '#cbd5e0',
      background: '#f7fafc'
    },
    answerRadio: {
      marginRight: '12px',
      width: '20px',
      height: '20px',
      cursor: 'pointer'
    },
    answerText: {
      fontSize: '16px',
      color: '#2d3748',
      lineHeight: '1.5'
    },
    navigationButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: '24px',
      borderTop: '1px solid #e2e8f0'
    },
    navButton: {
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: 'none'
    },
    prevButton: {
      background: '#f3f4f6',
      color: '#6b7280'
    },
    nextButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    },
    submitButton: {
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      color: 'white'
    },
    resultModal: {
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
    },
    resultContent: {
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '500px',
      width: '90%',
      textAlign: 'center'
    },
    resultIcon: {
      fontSize: '64px',
      marginBottom: '16px'
    },
    resultTitle: {
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '8px',
      margin: 0
    },
    resultScore: {
      fontSize: '48px',
      fontWeight: '700',
      color: '#667eea',
      marginBottom: '16px'
    },
    resultDetails: {
      color: '#718096',
      marginBottom: '24px',
      lineHeight: '1.5'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#718096'
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '16px'
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/applications/tests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTests(res.data);
      } catch (err) {
        setError('Không thể tải danh sách bài test!');
        setTests([]);
      }
      setLoading(false);
    };
    fetchTests();
  }, []);

  const mockQuestions = [
    {
      id: 1,
      question_text: 'What is the correct way to declare a variable in JavaScript?',
      answer_a: 'var myVar = 5;',
      answer_b: 'variable myVar = 5;',
      answer_c: 'v myVar = 5;',
      answer_d: 'declare myVar = 5;',
      correct_answer: 'A'
    },
    {
      id: 2,
      question_text: 'Which method is used to add an element to the end of an array?',
      answer_a: 'push()',
      answer_b: 'add()',
      answer_c: 'append()',
      answer_d: 'insert()',
      correct_answer: 'A'
    },
    {
      id: 3,
      question_text: 'What does DOM stand for?',
      answer_a: 'Document Object Model',
      answer_b: 'Data Object Management',
      answer_c: 'Dynamic Object Model',
      answer_d: 'Document Oriented Model',
      correct_answer: 'A'
    }
  ];

  useEffect(() => {
    let interval = null;
    if (testStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && testStarted) {
      handleSubmitTest();
    }
    return () => clearInterval(interval);
  }, [testStarted, timeLeft]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chưa làm';
      case 'completed': return 'Đã hoàn thành';
      case 'expired': return 'Hết hạn';
      default: return status;
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'pending': return styles.statusPending;
      case 'completed': return styles.statusCompleted;
      case 'expired': return styles.statusExpired;
      default: return styles.statusPending;
    }
  };

  const handleStartTest = async (test) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3001/api/tests/${test.id}/questions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const questionsData = Array.isArray(res.data) ? res.data : [];
      if (!questionsData.length) {
        setError('Bài test này chưa có câu hỏi. Vui lòng liên hệ nhà tuyển dụng!');
        setLoading(false);
        return;
      }
      setDoingTest(test);
      setTestStarted(true);
      setTestResult(null);
      setCurrentQuestion(0);
      setAnswers({});
      setQuestions(questionsData);
      setTimeLeft(Number(test.duration) * 60);
      setLoading(false);
    } catch (err) {
      setQuestions([]);
      setLoading(false);
      setError('Không thể tải câu hỏi cho bài test này!');
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitTest = async () => {
    setTestStarted(false);
    
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) {
        score++;
      }
    });

    const result = {
      score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100)
    };

    setTestResult(result);
    
    setTests(tests.map(t => 
      t.id === doingTest.id 
        ? { ...t, status: 'completed', score: score }
        : t
    ));

    toast.success(`Nộp bài thành công! Điểm số: ${score}/${questions.length}`);
  };

  const handleCloseResult = () => {
    setTestResult(null);
    setDoingTest(null);
  };

  if (loading) {
    return (
      <div style={{...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '32px', marginBottom: '16px'}}>⏳</div>
          <div style={{color: '#718096'}}>Đang tải bài test...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>❌</div>
        <h3 style={{color: '#e53e3e', marginBottom: '8px'}}>Lỗi tải dữ liệu</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (doingTest && !testResult) {
    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div style={styles.container}>
        <div style={styles.testInterface}>
          <div style={styles.testInterfaceHeader}>
            <div>
              <h2 style={styles.testInterfaceTitle}>{doingTest.title}</h2>
              <div style={styles.progressBar}>
                <div style={{...styles.progressFill, width: `${progress}%`}}></div>
              </div>
            </div>
            <div style={styles.timer}>
              <span role="img" aria-label="timer">⏰</span> {formatTime(Math.max(0, timeLeft))}
            </div>
          </div>

          <div style={styles.questionContainer}>
            <div style={styles.questionHeader}>
              <div style={styles.questionNumber}>
                Câu hỏi {currentQuestion + 1} / {questions.length}
              </div>
            </div>

            <div style={styles.questionText}>
              {currentQ?.question_text}
            </div>

            <div style={styles.answersContainer}>
              {['A', 'B', 'C', 'D'].map(option => (
                <div
                  key={option}
                  style={{
                    ...styles.answerOption,
                    ...(answers[currentQ?.id] === option ? styles.answerOptionSelected : {})
                  }}
                  onClick={() => handleAnswerSelect(currentQ?.id, option)}
                  onMouseEnter={(e) => {
                    if (answers[currentQ?.id] !== option) {
                      Object.assign(e.currentTarget.style, styles.answerOptionHover);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (answers[currentQ?.id] !== option) {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.background = 'white';
                    }
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${currentQ?.id}`}
                    value={option}
                    checked={answers[currentQ?.id] === option}
                    onChange={() => {}}
                    style={styles.answerRadio}
                  />
                  <div style={styles.answerText}>
                    <strong>{option}.</strong> {currentQ?.[`answer_${option.toLowerCase()}`]}
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.navigationButtons}>
              <button
                style={{
                  ...styles.navButton,
                  ...styles.prevButton,
                  opacity: currentQuestion === 0 ? 0.5 : 1,
                  cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
                }}
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
              >
                ← Câu trước
              </button>

              {currentQuestion === questions.length - 1 ? (
                <button
                  style={{...styles.navButton, ...styles.submitButton}}
                  onClick={handleSubmitTest}
                >
                  🎯 Nộp bài
                </button>
              ) : (
                <button
                  style={{...styles.navButton, ...styles.nextButton}}
                  onClick={handleNextQuestion}
                >
                  Câu tiếp →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><span role="img" aria-label="test">📝</span> Làm bài test</h1>
        <p style={styles.subtitle}>
          Hoàn thành các bài kiểm tra để tăng cơ hội được tuyển dụng
        </p>
      </div>

        {testResult && (
        <div style={{
          background: '#d1ecf1',
          border: '1px solid #bee5eb',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{fontSize: '24px'}}>🎉</div>
          <div>
            <div style={{fontWeight: '600', color: '#0c5460'}}>
              Đã nộp bài thành công!
            </div>
            <div style={{color: '#0c5460', fontSize: '14px'}}>
              Điểm số của bạn: {testResult.score}/{testResult.total} ({testResult.percentage}%)
            </div>
          </div>
          </div>
        )}

      {tests.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📝</div>
          <h3 style={{color: '#4a5568', marginBottom: '8px'}}>Không có bài test nào</h3>
          <p>Hãy ứng tuyển các vị trí việc làm để nhận được bài test từ nhà tuyển dụng.</p>
        </div>
      ) : (
        <div style={styles.testsGrid}>
          {tests.map(test => (
            <div
              key={test.id}
              style={styles.testCard}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.testCardHover)}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
              }}
            >
              <div style={styles.testHeader}>
                <div>
                  <h3 style={styles.testTitle}>{test.title}</h3>
                  <div style={styles.testCompany}>{test.company_name}</div>
                </div>
                <span style={{...styles.statusBadge, ...getStatusBadgeStyle(test.status)}}>
                  {getStatusText(test.status)}
                </span>
              </div>

              <div style={styles.testDetails}>
                <div style={styles.testDetail}>
                  ⏱️ {test.duration} phút
                </div>
                <div style={styles.testDetail}>
                  📝 {test.questions} câu hỏi
                </div>
                <div style={styles.testDetail}>
                  📅 Hạn: {formatDate(test.deadline)}
                </div>
                {test.score !== null && (
                  <div style={styles.testDetail}>
                    🎯 Điểm: {test.score}/{test.questions}
              </div>
                )}
              </div>

              <div style={styles.testActions}>
              {test.status === 'pending' && (
                  <button
                    style={styles.startButton}
                    onClick={() => handleStartTest(test)}
                    disabled={test.status !== 'pending'}
                  >
                    <span role="img" aria-label="test">📝</span> Làm bài test
                  </button>
                )}
                
                {test.status === 'completed' && (
                  <>
                    <button style={styles.completedButton}>
                      ✅ Đã hoàn thành
                    </button>
                    <button style={styles.viewResultButton}>
                      📊 Xem kết quả
                    </button>
                  </>
                )}
                
                {test.status === 'expired' && (
                  <button style={styles.completedButton}>
                    ⏰ Đã hết hạn
                </button>
              )}
              </div>
            </div>
          ))}
        </div>
      )}

      {testResult && (
        <div style={styles.resultModal}>
          <div style={styles.resultContent}>
            <div style={styles.resultIcon}>
              {testResult.percentage >= 80 ? '🎉' : testResult.percentage >= 60 ? '😊' : '😔'}
            </div>
            <h2 style={styles.resultTitle}>Kết quả bài test</h2>
            <div style={styles.resultScore}>
              {testResult.score}/{testResult.total}
            </div>
            <div style={styles.resultDetails}>
              Bạn đã trả lời đúng {testResult.score} trên {testResult.total} câu hỏi.
              <br />
              Điểm số: {testResult.percentage}%
              <br />
              {testResult.percentage >= 80 && "Xuất sắc! Bạn có kiến thức rất tốt."}
              {testResult.percentage >= 60 && testResult.percentage < 80 && "Tốt! Bạn đã làm bài khá ổn."}
              {testResult.percentage < 60 && "Cần cải thiện thêm. Hãy ôn tập và thử lại!"}
            </div>
            <button
              style={{...styles.navButton, ...styles.nextButton}}
              onClick={handleCloseResult}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications; 