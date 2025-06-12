-- Bảng tài khoản người dùng
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    role ENUM('candidate', 'recruiter', 'talenthub_staff') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng nhà tuyển dụng
CREATE TABLE IF NOT EXISTS recruiters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng chi nhánh công ty
CREATE TABLE IF NOT EXISTS branches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id INT NOT NULL,
    branch_name VARCHAR(255),
    area VARCHAR(100),
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE
);

-- Bảng danh mục ngành nghề
CREATE TABLE IF NOT EXISTS job_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Bảng tin tuyển dụng
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id INT NOT NULL,
    branch_id INT,
    title VARCHAR(255) NOT NULL,
    category_id INT,
    area VARCHAR(100),
    position VARCHAR(100),
    salary VARCHAR(100),
    job_type ENUM('full-time', 'part-time', 'freelance', 'contract'),
    requirement TEXT,
    benefit TEXT,
    posted_date DATE,
    deadline DATE,
    status ENUM('pending', 'active', 'closed') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (category_id) REFERENCES job_categories(id)
);

-- Bảng hồ sơ ứng viên (CV)
CREATE TABLE IF NOT EXISTS candidate_cv (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    birthdate DATE,
    phone VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(255),
    education VARCHAR(255),
    certificates TEXT,
    experience TEXT,
    file_path VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng ứng tuyển
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_cv_id INT NOT NULL,
    job_id INT NOT NULL,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'invited', 'tested', 'interviewed', 'rejected', 'accepted') DEFAULT 'pending',
    FOREIGN KEY (candidate_cv_id) REFERENCES candidate_cv(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- Bảng bài test
CREATE TABLE IF NOT EXISTS tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    test_name VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- Bảng câu hỏi (mỗi câu hỏi thuộc duy nhất một bài test)
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL,
    question_text TEXT NOT NULL,
    answer_a VARCHAR(255),
    answer_b VARCHAR(255),
    answer_c VARCHAR(255),
    answer_d VARCHAR(255),
    correct_answer CHAR(1), -- A/B/C/D
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

-- Bảng kết quả test
CREATE TABLE IF NOT EXISTS test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL,
    candidate_cv_id INT NOT NULL,
    score FLOAT,
    taken_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_cv_id) REFERENCES candidate_cv(id) ON DELETE CASCADE
);

-- Bảng phỏng vấn
CREATE TABLE IF NOT EXISTS interviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    interview_date DATETIME,
    location VARCHAR(255),
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- Bảng đánh giá sau phỏng vấn
CREATE TABLE IF NOT EXISTS interview_feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    interview_id INT NOT NULL,
    interviewer_name VARCHAR(100),
    feedback TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
);

-- Bảng thông báo (email, sms)
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('email', 'sms'),
    content TEXT,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng lưu lịch sử import LinkedIn
CREATE TABLE IF NOT EXISTS linkedin_imports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id INT NOT NULL,
    import_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    data TEXT,
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE
);

-- Bảng nhân viên TalentHub
CREATE TABLE IF NOT EXISTS talenthub_staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(100),
    position VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
); 

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE linkedin_imports;
TRUNCATE TABLE interview_feedback;
TRUNCATE TABLE interviews;
TRUNCATE TABLE test_results;
TRUNCATE TABLE questions;
TRUNCATE TABLE tests;
TRUNCATE TABLE applications;
TRUNCATE TABLE candidate_cv;
TRUNCATE TABLE jobs;
TRUNCATE TABLE job_categories;
TRUNCATE TABLE branches;
TRUNCATE TABLE recruiters;
TRUNCATE TABLE talenthub_staff;
TRUNCATE TABLE notifications;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- Thêm dữ liệu vào bảng users
INSERT INTO users (username, password, email, phone, role, created_at) VALUES
('candidate01', '123456', 'candidate1@example.com', '0123456789', 'candidate', NOW()),
('candidate02', '123456', 'candidate2@example.com', '0123456799', 'candidate', NOW()),
('recruiter01', '123456', 'recruiter1@company.com', '0987654321', 'recruiter', NOW()),
('staff01', '123456', 'staff1@talenthub.com', '0912345678', 'talenthub_staff', NOW());

-- Thêm dữ liệu vào bảng recruiters
INSERT INTO recruiters (user_id, company_name, address, created_at) VALUES
(3, 'TechCorp', '123 Đường Láng, Hà Nội', NOW()); -- Sửa user_id thành 3 (recruiter01)

-- Thêm dữ liệu vào bảng branches
INSERT INTO branches (recruiter_id, branch_name, area) VALUES
(1, 'Chi nhánh Hà Nội', 'Hà Nội'),
(1, 'Chi nhánh TP.HCM', 'TP.HCM');

-- Thêm dữ liệu vào bảng job_categories
INSERT INTO job_categories (name) VALUES
('Công nghệ thông tin'),
('Marketing'),
('Tài chính');

-- Thêm dữ liệu vào bảng jobs
INSERT INTO jobs (recruiter_id, branch_id, title, category_id, area, position, salary, job_type, requirement, benefit, posted_date, deadline, status, created_at) VALUES
(1, 1, 'Lập trình viên Java', 1, 'Hà Nội', 'Senior Developer', '20-30 triệu', 'full-time', '3+ năm kinh nghiệm Java, Spring', 'Bảo hiểm, thưởng dự án', '2025-05-30', '2025-06-15', 'active', NOW()),
(1, 2, 'Nhân viên Marketing', 2, 'TP.HCM', 'Marketing Executive', '15-20 triệu', 'full-time', '2+ năm kinh nghiệm Marketing', 'Du lịch hàng năm', '2025-05-30', '2025-06-10', 'pending', NOW()),
(1, 1, 'Kỹ sư DevOps', 1, 'Hà Nội', 'DevOps Engineer', '25-35 triệu', 'full-time', '2+ năm kinh nghiệm AWS, Docker', 'Bảo hiểm, nghỉ phép 15 ngày/năm', '2025-05-30', '2025-06-20', 'active', NOW()),
(1, 2, 'Nhân viên Content Marketing', 2, 'TP.HCM', 'Content Creator', '12-18 triệu', 'part-time', '1+ năm kinh nghiệm viết nội dung', 'Linh hoạt giờ làm', '2025-05-30', '2025-06-15', 'pending', NOW()),
(1, 1, 'Chuyên viên tài chính', 3, 'Hà Nội', 'Financial Analyst', '18-25 triệu', 'full-time', '3+ năm kinh nghiệm phân tích tài chính', 'Thưởng cuối năm', '2025-05-30', '2025-06-25', 'active', NOW()),
(1, 2, 'Lập trình viên Front-end', 1, 'TP.HCM', 'Front-end Developer', '20-30 triệu', 'contract', '2+ năm kinh nghiệm React, Vue', 'Hỗ trợ máy tính', '2025-05-30', '2025-06-18', 'pending', NOW()),
(1, 1, 'Nhân viên thiết kế UX/UI', 1, 'Hà Nội', 'UX/UI Designer', '15-22 triệu', 'full-time', '2+ năm kinh nghiệm Figma, Adobe XD', 'Môi trường sáng tạo', '2025-05-30', '2025-06-30', 'active', NOW());

-- Thêm dữ liệu vào bảng candidate_cv
INSERT INTO candidate_cv (user_id, fullname, birthdate, phone, email, address, education, certificates, experience, file_path, created_at) VALUES
(1, 'Nguyễn Văn A', '1995-03-15', '0123456789', 'candidate1@example.com', '456 Đường Láng, Hà Nội', 'Đại học Bách Khoa', 'Chứng chỉ Java', '3 năm làm việc tại TechCorp', '/cv/nguyenvana.pdf', NOW()),
(2, 'Nguyễn Văn B', '1996-04-20', '0123456799', 'candidate2@example.com', '789 Đường Láng, Hà Nội', 'Đại học Kinh Tế', 'Chứng chỉ Marketing', '2 năm làm việc tại MarketInc', '/cv/nguyenvanb.pdf', NOW()); -- Sửa thông tin cho candidate02

-- Thêm dữ liệu vào bảng applications
INSERT INTO applications (candidate_cv_id, job_id, applied_at, status) VALUES
(1, 1, NOW(), 'pending'), -- candidate01 ứng tuyển Lập trình viên Java
(1, 2, NOW(), 'pending'), -- candidate01 ứng tuyển Nhân viên Marketing
(2, 1, NOW(), 'pending'), -- MỚI: candidate02 ứng tuyển Lập trình viên Java
(2, 2, NOW(), 'pending'); -- MỚI: candidate02 ứng tuyển Nhân viên Marketing

-- Thêm dữ liệu vào bảng tests
INSERT INTO tests (job_id, test_name, created_at) VALUES
(1, 'Kiểm tra Java cơ bản', NOW()),
(2, 'Kiểm tra Marketing cơ bản', NOW());

-- Thêm dữ liệu vào bảng questions
INSERT INTO questions (test_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer) VALUES
-- Câu hỏi cho bài test Java (test_id = 1)
(1, 'Kết quả của System.out.println(5 + 3 + "Java"); là gì?', '8Java', 'Java8', '53Java', 'Java53', 'A'),
(1, 'Trong Java, từ khóa nào được sử dụng để kế thừa một lớp?', 'extends', 'implements', 'super', 'this', 'A'),
(1, 'Kết quả của 10 % 3 trong Java là gì?', '1', '2', '3', '0', 'A'),
(1, 'Phương thức main trong Java có kiểu trả về là gì?', 'void', 'int', 'String', 'boolean', 'A'),
(1, 'Garbage Collector trong Java làm gì?', 'Quản lý bộ nhớ', 'Xử lý lỗi', 'Tối ưu mã', 'Kết nối database', 'A'),
(1, 'ArrayList trong Java thuộc gói nào?', 'java.util', 'java.io', 'java.net', 'java.lang', 'A'),
(1, 'Từ khóa nào khai báo một hằng số trong Java?', 'final', 'static', 'const', 'volatile', 'A'),
(1, 'Trong Java, interface có thể chứa phương thức nào?', 'Abstract', 'Static', 'Final', 'Private', 'A'),
(1, 'Kết quả của "Hello".substring(1, 3) là gì?', 'el', 'ell', 'llo', 'he', 'A'),
(1, 'Lớp nào trong Java xử lý ngoại lệ?', 'Exception', 'Error', 'Throwable', 'Catch', 'C'),
(1, 'Java hỗ trợ đa thừa kế thông qua lớp không?', 'Không', 'Có', 'Chỉ với interface', 'Chỉ với abstract class', 'A'),
(1, 'Phương thức nào được gọi khi một đối tượng bị hủy?', 'finalize()', 'destroy()', 'delete()', 'remove()', 'A'),
(1, 'Trong Java, từ khóa synchronized dùng để làm gì?', 'Đồng bộ hóa thread', 'Khóa lớp', 'Tăng tốc độ', 'Quản lý bộ nhớ', 'A'),
(1, 'Kiểu dữ liệu nào không phải là kiểu nguyên thủy trong Java?', 'String', 'int', 'double', 'boolean', 'A'),
(1, 'HashMap trong Java lưu trữ dữ liệu theo dạng gì?', 'Key-Value', 'Array', 'List', 'Stack', 'A'),
(1, 'Trong Java, từ khóa throw được dùng để làm gì?', 'Ném ngoại lệ', 'Bắt ngoại lệ', 'Khai báo ngoại lệ', 'Kết thúc chương trình', 'A'),
(1, 'Gói nào chứa lớp Scanner trong Java?', 'java.util', 'java.io', 'java.lang', 'java.text', 'A'),
(1, 'Kết quả của 5 == "5" trong Java là gì?', 'false', 'true', 'Lỗi biên dịch', 'Lỗi runtime', 'A'),
(1, 'Trong Java, từ khóa nào khai báo một lớp trừu tượng?', 'abstract', 'interface', 'final', 'static', 'A'),
(1, 'Phương thức toString() thuộc lớp nào?', 'Object', 'String', 'System', 'Class', 'A'),
(1, 'Java sử dụng cơ chế nào để quản lý bộ nhớ?', 'Garbage Collection', 'Manual Allocation', 'Stack Allocation', 'Heap Allocation', 'A'),
(1, 'Trong Java, từ khóa super dùng để làm gì?', 'Gọi hàm của lớp cha', 'Tạo đối tượng mới', 'Khóa phương thức', 'Tăng hiệu suất', 'A'),
(1, 'Kết quả của 3 + 2 * 5 trong Java là gì?', '13', '15', '25', '10', 'A'),
(1, 'Lớp nào trong Java dùng để làm việc với file?', 'File', 'Stream', 'Reader', 'Writer', 'A'),
(1, 'Trong Java, từ khóa volatile đảm bảo điều gì?', 'Tính nhất quán dữ liệu', 'Tăng tốc độ', 'Khóa thread', 'Ngăn chặn ngoại lệ', 'A'),
(1, 'Phương thức nào dùng để so sánh hai chuỗi trong Java?', 'equals()', 'compareTo()', '==', 'matches()', 'A'),
(1, 'Trong Java, Exception là gì?', 'Lỗi runtime', 'Lỗi biên dịch', 'Lớp cơ sở cho ngoại lệ', 'Phương thức xử lý lỗi', 'C'),
(1, 'HashSet trong Java có đặc điểm gì?', 'Không cho phép phần tử trùng lặp', 'Cho phép phần tử trùng lặp', 'Sắp xếp tự động', 'Lưu trữ theo cặp', 'A'),
(1, 'Trong Java, từ khóa try dùng để làm gì?', 'Bắt đầu khối xử lý ngoại lệ', 'Kết thúc chương trình', 'Khai báo biến', 'Tạo thread', 'A'),
(1, 'Kết quả của "abc".toUpperCase() là gì?', 'ABC', 'abc', 'Abc', 'Lỗi', 'A'),
(1, 'Trong Java, từ khóa static có ý nghĩa gì?', 'Chia sẻ giữa các instance', 'Khóa phương thức', 'Tăng tốc độ', 'Ngăn kế thừa', 'A'),
-- Câu hỏi cho bài test Marketing (test_id = 2)
(2, 'Mục tiêu chính của Marketing là gì?', 'Tăng doanh số', 'Xây dựng thương hiệu', 'Thu hút khách hàng', 'Tất cả các đáp án trên', 'D'),
(2, 'SEO là viết tắt của gì?', 'Search Engine Optimization', 'Social Engagement Option', 'Search Engine Operation', 'Social Engine Optimization', 'A'),
(2, '4P trong Marketing bao gồm gì?', 'Product, Price, Place, Promotion', 'Plan, Price, Product, People', 'Promotion, Plan, Place, Profit', 'People, Process, Product, Price', 'A'),
(2, 'Công cụ nào thường được dùng để phân tích đối thủ cạnh tranh?', 'SWOT', 'Excel', 'Word', 'PowerPoint', 'A'),
(2, 'Inbound Marketing tập trung vào điều gì?', 'Thu hút khách hàng tự nhiên', 'Quảng cáo trả phí', 'Bán hàng trực tiếp', 'Tổ chức sự kiện', 'A');



-- Thêm dữ liệu vào bảng interviews
INSERT INTO interviews (application_id, interview_date, location, status) VALUES
(1, '2025-06-05 10:00:00', 'Văn phòng TechCorp Hà Nội', 'scheduled'), -- candidate01, Lập trình viên Java
(2, '2025-06-06 14:00:00', 'Văn phòng TechCorp TP.HCM', 'scheduled'), -- candidate01, Nhân viên Marketing
(3, '2025-06-05 11:00:00', 'Văn phòng TechCorp Hà Nội', 'scheduled'), -- MỚI: candidate02, Lập trình viên Java
(4, '2025-06-06 15:00:00', 'Văn phòng TechCorp TP.HCM', 'scheduled'); -- MỚI: candidate02, Nhân viên Marketing

-- Thêm dữ liệu vào bảng interview_feedback
INSERT INTO interview_feedback (interview_id, interviewer_name, feedback, created_at) VALUES
(1, 'Trần Thị B', 'Ứng viên có kỹ năng tốt, cần cải thiện giao tiếp', NOW()), -- candidate01, Lập trình viên Java
(2, 'Nguyễn Văn C', 'Ứng viên có kiến thức Marketing tốt, sáng tạo', NOW()), -- candidate01, Nhân viên Marketing
(3, 'Trần Thị B', 'Ứng viên có kiến thức Java khá, cần thực hành nhiều hơn', NOW()), -- MỚI: candidate02, Lập trình viên Java
(4, 'Nguyễn Văn C', 'Ứng viên có kỹ năng Marketing tốt, cần cải thiện chiến lược nội dung', NOW()); -- MỚI: candidate02, Nhân viên Marketing



-- Thêm dữ liệu vào bảng notifications
INSERT INTO notifications (user_id, type, content, sent_at) VALUES
(1, 'email', 'Bạn đã ứng tuyển thành công vào vị trí Lập trình viên Java', NOW()), -- candidate01
(3, 'sms', 'Có ứng viên mới ứng tuyển vào vị trí Lập trình viên Java', NOW()), -- recruiter01
(1, 'email', 'Bạn đã ứng tuyển thành công vào vị trí Nhân viên Marketing', NOW()), -- candidate01
(3, 'sms', 'Có ứng viên mới ứng tuyển vào vị trí Nhân viên Marketing', NOW()), -- recruiter01
(1, 'email', 'Bạn được mời phỏng vấn cho vị trí Lập trình viên Java vào ngày 2025-06-05', NOW()), -- candidate01
(1, 'email', 'Bạn được mời phỏng vấn cho vị trí Nhân viên Marketing vào ngày 2025-06-06', NOW()), -- candidate01
(2, 'email', 'Bạn đã ứng tuyển thành công vào vị trí Lập trình viên Java', NOW()), -- MỚI: candidate02
(3, 'sms', 'Có ứng viên mới ứng tuyển vào vị trí Lập trình viên Java', NOW()), -- MỚI: recruiter01
(2, 'email', 'Bạn đã ứng tuyển thành công vào vị trí Nhân viên Marketing', NOW()), -- MỚI: candidate02
(3, 'sms', 'Có ứng viên mới ứng tuyển vào vị trí Nhân viên Marketing', NOW()), -- MỚI: recruiter01
(2, 'email', 'Bạn được mời phỏng vấn cho vị trí Lập trình viên Java vào ngày 2025-06-05', NOW()), -- MỚI: candidate02
(2, 'email', 'Bạn được mời phỏng vấn cho vị trí Nhân viên Marketing vào ngày 2025-06-06', NOW()); -- MỚI: candidate02



INSERT INTO linkedin_imports (recruiter_id, import_time, data) VALUES
(1, NOW(), '{"profile": "LinkedIn profile data"}');

-- Thêm dữ liệu vào bảng talenthub_staff
INSERT INTO talenthub_staff (user_id, full_name, position, created_at) VALUES
(4, 'Lê Thị C', 'Quản lý nhân sự', NOW()); -- Sửa user_id thành 4 (staff01)