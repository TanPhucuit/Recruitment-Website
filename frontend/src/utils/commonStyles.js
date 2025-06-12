// 🎨 Common styles để tái sử dụng
export const commonStyles = {
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
  button: {
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  primaryButton: {
    backgroundColor: '#3182ce',
    color: 'white',
    padding: '12px 20px'
  },
  successButton: {
    backgroundColor: '#38a169',
    color: 'white',
    padding: '12px 20px'
  },
  dangerButton: {
    backgroundColor: '#e53e3e',
    color: 'white',
    padding: '6px 12px'
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  table: {
    fontSize: '15px',
    width: '100%',
    tableLayout: 'fixed',
    borderCollapse: 'collapse',
    borderSpacing: 0,
    minWidth: '800px'
  },
  tableHeader: {
    background: '#f7fafc',
    fontWeight: 500
  },
  tableHeaderCell: {
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#4a5568'
  },
  tableCell: {
    padding: '12px',
    fontWeight: 400,
    borderBottom: '1px solid #f0f0f0'
  },
  modal: {
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
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto'
  }
};

// 🎯 Status colors
export const statusColors = {
  active: { bg: '#c6f6d5', color: '#22543d' },
  pending: { bg: '#fff3cd', color: '#856404' },
  rejected: { bg: '#fed7d7', color: '#822727' },
  completed: { bg: '#d1ecf1', color: '#0c5460' },
  expired: { bg: '#fbb6ce', color: '#702459' }
};

// 📅 Utility functions
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return '-';
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '-';
  }
}; 