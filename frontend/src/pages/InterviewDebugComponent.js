import React, { useState, useEffect } from 'react';

const InterviewDebugComponent = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user info from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (e) {
        setError('Invalid token');
      }
    }
  }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/interviews/sent', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setInterviews(data);
      console.log('✅ Interviews fetched:', data);
      
    } catch (err) {
      setError(err.message);
      console.error('❌ Error fetching interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const testCreateInterview = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/interviews', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          application_id: 1, // Test với application_id = 1
          interview_date: '2025-06-15 10:00:00',
          location: 'Test Location'
        })
      });
      
      const result = await response.json();
      console.log('Create interview result:', result);
      
      if (response.ok) {
        alert('✅ Tạo lời mời phỏng vấn thành công!');
        fetchInterviews(); // Reload list
      } else {
        alert('❌ Lỗi: ' + result.error);
      }
      
    } catch (err) {
      console.error('Error creating interview:', err);
      alert('❌ Lỗi: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>🔍 Interview API Debug Tool</h2>
      
      {/* User Info */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <h4>👤 User Information</h4>
        {user ? (
          <div>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        ) : (
          <p>❌ No user token found</p>
        )}
      </div>

      {/* Controls */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={fetchInterviews}
          disabled={loading}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? '⏳ Loading...' : '📥 Fetch Interviews'}
        </button>
        
        {user?.role === 'recruiter' && (
          <button 
            onClick={testCreateInterview}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🆕 Test Create Interview
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          <h4>❌ Error</h4>
          <p>{error}</p>
        </div>
      )}

      {/* Results */}
      <div style={{
        background: 'white',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h4>📋 Interview Results ({interviews.length})</h4>
        
        {interviews.length === 0 ? (
          <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
            No interviews found. Check:
            <br />• API endpoint is correct
            <br />• User has recruiter role
            <br />• Database has interview data
            <br />• Applications are linked to this recruiter's jobs
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'left' }}>Candidate</th>
                  <th style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'left' }}>Job Title</th>
                  <th style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'left' }}>Location</th>
                  <th style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map(interview => (
                  <tr key={interview.id}>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{interview.id}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{interview.candidate_name}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{interview.job_title}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>
                      {new Date(interview.interview_date).toLocaleString()}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{interview.location}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: interview.status === 'scheduled' ? '#d4edda' : 
                                   interview.status === 'completed' ? '#cce5ff' : '#f8d7da',
                        color: interview.status === 'scheduled' ? '#155724' : 
                               interview.status === 'completed' ? '#004085' : '#721c24'
                      }}>
                        {interview.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Raw Data */}
      {interviews.length > 0 && (
        <details style={{ marginTop: '20px' }}>
          <summary style={{ cursor: 'pointer', padding: '10px', background: '#f8f9fa' }}>
            🔍 Raw JSON Data
          </summary>
          <pre style={{ 
            background: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {JSON.stringify(interviews, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default InterviewDebugComponent; 