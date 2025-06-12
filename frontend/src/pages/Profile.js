import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [showUploadCV, setShowUploadCV] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/api/candidate/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (err) {
      setProfile(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleDeleteProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:3001/api/candidate/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(null);
    } catch (err) {}
  };

  const handleCreateProfile = (e) => {
    e.preventDefault();
    // TODO: Implement create profile logic
    setShowCreateProfile(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // TODO: Implement file upload logic
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="interface">
      <main className="main-content">
        <div className="action-buttons">
          <button className="action-button" onClick={() => setShowCreateProfile(true)}>
            + Tạo mới hồ sơ
          </button>
          <button className="action-button" onClick={() => setShowUploadCV(true)}>
            CV
          </button>
          {profile && (
            <button className="action-button" onClick={handleDeleteProfile}>
              Xóa hồ sơ
            </button>
          )}
        </div>
        {!showCreateProfile && !showUploadCV && profile && (
          <section className="profile-form-container">
            <h1 className="profile-title">Hồ sơ của bạn</h1>
            <div className="profile-info">
              <div className="form-group">
                <div className="form-label">Họ và tên</div>
                <div className="form-value">{profile.fullname}</div>
              </div>
              <div className="form-group">
                <div className="form-label">Ngày sinh</div>
                <div className="form-value">{profile.birthdate}</div>
              </div>
              <div className="form-group">
                <div className="form-label">Số điện thoại</div>
                <div className="form-value">{profile.phone}</div>
              </div>
              <div className="form-group">
                <div className="form-label">Email</div>
                <div className="form-value">{profile.email}</div>
              </div>
              <div className="form-group">
                <div className="form-label">Địa chỉ</div>
                <div className="form-value">{profile.address}</div>
              </div>
              <div className="form-group">
                <div className="form-label">Trình độ học vấn</div>
                <div className="form-value">{profile.education}</div>
              </div>
              <div className="form-group">
                <div className="form-label">Chứng chỉ</div>
                <div className="form-value">{profile.certificates}</div>
              </div>
              <div className="form-group">
                <div className="form-label">Kinh nghiệm</div>
                <div className="form-value">{profile.experience}</div>
              </div>
              <div className="form-group">
                <div className="form-label">CV đã upload</div>
                <a className="form-value" href={profile.file_path} target="_blank" rel="noopener noreferrer">Tải CV</a>
              </div>
            </div>
          </section>
        )}
        {!showCreateProfile && !showUploadCV && !profile && (
          <div>Chưa có hồ sơ. Hãy tạo mới!</div>
        )}

        {showCreateProfile && (
          <section className="profile-form-container">
            <h2 className="profile-title">Hồ sơ của bạn</h2>
            <form className="profile-form" onSubmit={handleCreateProfile}>
              <div className="form-group">
                <label htmlFor="fullname" className="form-label">Họ và tên</label>
                <textarea id="fullname" className="form-textarea" defaultValue={profile?.fullname}></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="birthdate" className="form-label">Ngày sinh</label>
                <textarea id="birthdate" className="form-textarea" defaultValue={profile?.birthdate}></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Số điện thoại</label>
                <textarea id="phone" className="form-textarea" defaultValue={profile?.phone}></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <textarea id="email" className="form-textarea" defaultValue={profile?.email}></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="address" className="form-label">Địa chỉ</label>
                <textarea id="address" className="form-textarea" defaultValue={profile?.address}></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="education" className="form-label">Trình độ học vấn</label>
                <textarea id="education" className="form-textarea" defaultValue={profile?.education}></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="certificates" className="form-label">Chứng chỉ (nếu có)</label>
                <textarea id="certificates" className="form-textarea" defaultValue={profile?.certificates}></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="experience" className="form-label">Kinh nghiệm nghề nghiệp</label>
                <textarea id="experience" className="form-textarea" defaultValue={profile?.experience}></textarea>
              </div>
              <div className="form-actions">
                <button type="submit" className="button">Tạo</button>
              </div>
            </form>
            <button className="exitButton" onClick={() => setShowCreateProfile(false)}>Thoát</button>
          </section>
        )}

        {showUploadCV && (
          <section className="cv-section">
            <div id="cv-container" className="cv-container">
              <div id="no-cv-message" className="no-cv-message">
                <p>Bạn chưa có CV, tải lên ngay</p>
                <div className="upload-area">
                  <label htmlFor="cv-upload" className="upload-label">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="upload-icon">
                      <path d="M12 15V3M12 3L8 7M12 3L16 7" stroke="#3374ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 15V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V15" stroke="#3374ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Chọn file từ máy tính</span>
                  </label>
                  <input type="file" id="cv-upload" className="file-input" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
                </div>
              </div>
            </div>
            <button className="exitButton" onClick={() => setShowUploadCV(false)}>Thoát</button>
          </section>
        )}

        <div className="chat-icon-container">
          <svg className="chat-icon" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 0C11.1914 0 0 10.3906 0 23.2143C0 28.75 2.08984 33.817 5.56641 37.8013C4.3457 43.4263 0.263672 48.4375 0.214844 48.4933C0 48.75 -0.0585937 49.1295 0.0683594 49.4643C0.195312 49.7991 0.46875 50 0.78125 50C7.25586 50 12.1094 46.4509 14.5117 44.2634C17.7051 45.6362 21.25 46.4286 25 46.4286C38.8086 46.4286 50 36.0379 50 23.2143C50 10.3906 38.8086 0 25 0ZM12.5 26.7857C10.7715 26.7857 9.375 25.1897 9.375 23.2143C9.375 21.2388 10.7715 19.6429 12.5 19.6429C14.2285 19.6429 15.625 21.2388 15.625 23.2143C15.625 25.1897 14.2285 26.7857 12.5 26.7857ZM25 26.7857C23.2715 26.7857 21.875 25.1897 21.875 23.2143C21.875 21.2388 23.2715 19.6429 25 19.6429C26.7285 19.6429 28.125 21.2388 28.125 23.2143C28.125 25.1897 26.7285 26.7857 25 26.7857ZM37.5 26.7857C35.7715 26.7857 34.375 25.1897 34.375 23.2143C34.375 21.2388 35.7715 19.6429 37.5 19.6429C39.2285 19.6429 40.625 21.2388 40.625 23.2143C40.625 25.1897 39.2285 26.7857 37.5 26.7857Z" fill="black"/>
          </svg>
        </div>
      </main>
    </div>
  );
};

export default Profile; 