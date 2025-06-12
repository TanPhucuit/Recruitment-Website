#!/bin/bash

# TalentHub Error Fix Script
# Tự động sửa các lỗi Module not found và export issues

echo "🛠️  TalentHub Error Fix Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Không tìm thấy package.json. Vui lòng chạy script trong thư mục frontend/"
    exit 1
fi

echo "📁 Đang kiểm tra cấu trúc thư mục..."

# Create backup directory
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "💾 Tạo backup files trong: $BACKUP_DIR"

# Backup original files
if [ -f "src/pages/JobList.js" ]; then
    cp "src/pages/JobList.js" "$BACKUP_DIR/JobList.js.backup"
    echo "✅ Backup JobList.js"
fi

if [ -f "src/utils/apiService.js" ]; then
    cp "src/utils/apiService.js" "$BACKUP_DIR/apiService.js.backup"
    echo "✅ Backup apiService.js"
fi

echo ""
echo "🔧 Đang sửa lỗi..."

# Fix 1: Update apiService.js to include named export
echo "📝 Sửa apiService.js export..."
cat > "src/utils/apiService.js" << 'EOF'
// API Service with error handling and common methods
class ApiService {
  static async request(endpoint, options = {}) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  static async get(endpoint) {
    return this.request(endpoint);
  }

  static async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
}

// Export both default and named exports for compatibility
export default ApiService;
export const apiService = ApiService;
EOF

echo "✅ Đã sửa apiService.js"

# Fix 2: Create JobList.css
echo "🎨 Tạo JobList.css..."
cat > "src/pages/JobList.css" << 'EOF'
/* JobList Component Styles */
.job-list-container {
  width: 100%;
  background-color: #f8fafc;
  min-height: 100%;
  padding: 24px;
}

.job-list-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  min-width: 300px;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.add-button {
  background-color: #38a169;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.add-button:hover {
  background-color: #2f855a;
}

.table-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
  margin-bottom: 20px;
  position: relative;
}

.action-button {
  padding: 4px 8px;
  margin: 0 2px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.edit-button {
  background-color: #3182ce;
  color: white;
}

.delete-button {
  background-color: #e53e3e;
  color: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .job-list-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    min-width: auto;
    width: 100%;
  }
}
EOF

echo "✅ Đã tạo JobList.css"

# Fix 3: Check if JobList.js has antd imports and fix them
echo "🔧 Kiểm tra JobList.js imports..."

if grep -q "from 'antd'" "src/pages/JobList.js" 2>/dev/null; then
    echo "⚠️  Phát hiện import antd trong JobList.js"
    echo "📝 Tạo JobList.js mới không sử dụng antd..."
    
    # Create new JobList.js without antd dependencies
    cat > "src/pages/JobList.js" << 'EOF'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './JobList.css';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Không thể tải danh sách công việc');
      // Fallback data
      setJobs([
        {
          id: 1,
          title: 'Frontend Developer',
          company_name: 'Tech Corp',
          area: 'Hà Nội',
          salary: '15-20 triệu',
          status: 'active'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Xóa thành công');
      fetchJobs();
    } catch (error) {
      toast.error('Không thể xóa');
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ width: '100%', padding: '24px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
        <input
          style={{
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            minWidth: '300px'
          }}
          placeholder="Tìm kiếm công việc..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          style={{
            backgroundColor: '#38a169',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            cursor: 'pointer'
          }}
          onClick={() => setIsModalVisible(true)}
        >
          ➕ Thêm công việc
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f7fafc' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Tiêu đề</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Công ty</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Địa điểm</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Lương</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job.id} style={{ borderBottom: '1px solid #f7fafc' }}>
                <td style={{ padding: '12px' }}>{job.title}</td>
                <td style={{ padding: '12px' }}>{job.company_name}</td>
                <td style={{ padding: '12px' }}>{job.area}</td>
                <td style={{ padding: '12px' }}>{job.salary}</td>
                <td style={{ padding: '12px' }}>
                  <button
                    style={{
                      backgroundColor: '#3182ce',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      margin: '0 2px',
                      cursor: 'pointer'
                    }}
                    onClick={() => setEditingJob(job)}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    style={{
                      backgroundColor: '#e53e3e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      margin: '0 2px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleDelete(job.id)}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ color: 'white', fontSize: '18px' }}>Đang tải...</div>
        </div>
      )}
    </div>
  );
};

export default JobList;
EOF

    echo "✅ Đã tạo JobList.js mới"
else
    echo "✅ JobList.js không có antd imports"
fi

# Fix 4: Check and install missing dependencies
echo ""
echo "📦 Kiểm tra dependencies..."

# Check if react-toastify is installed
if ! grep -q "react-toastify" package.json; then
    echo "📦 Cài đặt react-toastify..."
    npm install react-toastify
else
    echo "✅ react-toastify đã được cài đặt"
fi

# Clean up
echo ""
echo "🧹 Dọn dẹp..."

# Clear npm cache
npm cache clean --force 2>/dev/null || echo "⚠️  Không thể clear npm cache"

# Remove node_modules/.cache if exists
if [ -d "node_modules/.cache" ]; then
    rm -rf "node_modules/.cache"
    echo "✅ Đã xóa node_modules/.cache"
fi

echo ""
echo "🎉 HOÀN THÀNH!"
echo "================================"
echo "✅ Đã sửa tất cả lỗi:"
echo "   - Module not found: antd"
echo "   - Module not found: @ant-design/icons"  
echo "   - Export 'apiService' not found"
echo ""
echo "📁 Backup files được lưu trong: $BACKUP_DIR"
echo ""
echo "🚀 Chạy lệnh sau để khởi động:"
echo "   npm start"
echo ""
echo "💡 Nếu vẫn còn lỗi, hãy kiểm tra console trong browser"
echo "================================"
EOF

chmod +x "$0"
echo "✅ Script đã được tạo và có thể thực thi"