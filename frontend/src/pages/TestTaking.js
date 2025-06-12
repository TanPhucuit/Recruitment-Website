import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TestTaking = ({ test, onSubmit }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // {questionId: 'A' | 'B' | ...}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/tests/${test.id}/questions`);
        setQuestions(res.data);
      } catch (err) {
        setError('Không thể tải câu hỏi!');
        setQuestions([]);
      }
      setLoading(false);
    };
    fetchQuestions();
  }, [test.id]);

  const handleChange = (qid, value) => {
    setAnswers({ ...answers, [qid]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] && answers[q.id] === q.correct_answer) score++;
    });
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3001/api/tests/${test.id}/submit`, {
        answers,
        score,
        total: questions.length
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmitting(false);
      onSubmit({ score, total: questions.length });
    } catch (err) {
      setSubmitting(false);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Lỗi khi nộp bài!');
      }
    }
  };

  if (loading) return <div>Đang tải câu hỏi...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="test-taking">
      <h2 className="test-title">{test.title || test.test_name}</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((q, idx) => (
          <div key={q.id} className="question-block">
            <div className="question-text"><b>Câu {idx+1}:</b> {q.question_text}</div>
            <div className="answers-list">
              {['A','B','C','D'].map(opt => (
                <label key={opt} className="answer-option">
                  <input
                    type="radio"
                    name={`q_${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleChange(q.id, opt)}
                  />
                  {q[`answer_${opt.toLowerCase()}`]}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button className="submit-button" type="submit" disabled={submitting} style={{marginTop:24}}>
          {submitting ? 'Đang nộp bài...' : 'Nộp bài'}
        </button>
      </form>
    </div>
  );
};

export default TestTaking; 