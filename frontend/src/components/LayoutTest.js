import React from 'react';

const LayoutTest = () => {
  const testStyle = {
    container: {
      width: '100%',
      height: '100vh',
      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      boxSizing: 'border-box'
    },
    header: {
      background: 'rgba(255,255,255,0.9)',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '20px',
      textAlign: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    content: {
      flex: 1,
      background: 'rgba(255,255,255,0.9)',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      background: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    th: {
      background: '#4a5568',
      color: 'white',
      padding: '12px',
      textAlign: 'left'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #e2e8f0'
    },
    debugInfo: {
      background: '#2d3748',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      marginTop: '20px',
      fontFamily: 'monospace',
      fontSize: '14px'
    }
  };

  React.useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById('layout-test-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        console.log('Container dimensions:', {
          width: rect.width,
          height: rect.height,
          left: rect.left,
          right: rect.right,
          screenWidth: window.innerWidth,
          utilization: ((rect.width / window.innerWidth) * 100).toFixed(1) + '%'
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const containerRef = React.useRef(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerWidth(rect.width);
    }
  }, []);

  const utilization = screenWidth > 0 ? ((containerWidth / screenWidth) * 100).toFixed(1) : 0;

  return (
    <div 
      id="layout-test-container"
      ref={containerRef}
      style={testStyle.container}
    >
      <div style={testStyle.header}>
        <h1 style={{ margin: 0, color: '#2d3748' }}>🧪 Layout Width Test</h1>
        <p style={{ margin: '8px 0 0 0', color: '#4a5568' }}>
          Testing if components use full width properly
        </p>
      </div>

      <div style={testStyle.content}>
        <h2 style={{ marginTop: 0, color: '#2d3748' }}>📊 Width Analysis</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: '#e6fffa',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#234e52' }}>
              {screenWidth}px
            </div>
            <div style={{ color: '#4a5568', fontSize: '14px' }}>Screen Width</div>
          </div>
          
          <div style={{
            background: '#f0fff4',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22543d' }}>
              {containerWidth}px
            </div>
            <div style={{ color: '#4a5568', fontSize: '14px' }}>Container Width</div>
          </div>
          
          <div style={{
            background: utilization > 90 ? '#f0fff4' : '#fff5f5',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: utilization > 90 ? '#22543d' : '#742a2a' 
            }}>
              {utilization}%
            </div>
            <div style={{ color: '#4a5568', fontSize: '14px' }}>Screen Utilization</div>
          </div>
        </div>

        <div style={{
          background: utilization > 90 ? '#c6f6d5' : '#fed7d7',
          border: `2px solid ${utilization > 90 ? '#38a169' : '#e53e3e'}`,
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <h3 style={{ 
            margin: '0 0 8px 0', 
            color: utilization > 90 ? '#22543d' : '#742a2a' 
          }}>
            {utilization > 90 ? '✅ PASS' : '❌ FAIL'} - Width Test
          </h3>
          <p style={{ margin: 0, color: '#4a5568' }}>
            {utilization > 90 
              ? 'Container is using screen width efficiently!' 
              : 'Container is not using full screen width. Check CSS constraints.'
            }
          </p>
        </div>

        <h3 style={{ color: '#2d3748' }}>📋 Test Table (Full Width)</h3>
        <table style={testStyle.table}>
          <thead>
            <tr>
              <th style={testStyle.th}>Column 1</th>
              <th style={testStyle.th}>Column 2</th>
              <th style={testStyle.th}>Column 3</th>
              <th style={testStyle.th}>Column 4</th>
              <th style={testStyle.th}>Column 5</th>
            </tr>
          </thead>
          <tbody>
            {[1,2,3].map(row => (
              <tr key={row}>
                <td style={testStyle.td}>Data {row}.1</td>
                <td style={testStyle.td}>Data {row}.2</td>
                <td style={testStyle.td}>Data {row}.3</td>
                <td style={testStyle.td}>Data {row}.4</td>
                <td style={testStyle.td}>Data {row}.5</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={testStyle.debugInfo}>
          <h4 style={{ margin: '0 0 8px 0' }}>🔧 Debug Information</h4>
          <div>Current Time: {new Date().toLocaleString()}</div>
          <div>User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 80) : 'N/A'}...</div>
          <div>Viewport: {screenWidth} x {typeof window !== 'undefined' ? window.innerHeight : 0}</div>
          <div>
            Status: {utilization > 90 ? 'Layout working correctly ✅' : 'Layout needs fixing ❌'}
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default LayoutTest; 