# TalentHub - Recruitment Management System

A comprehensive web application for managing recruitment processes, connecting candidates with recruiters through an intuitive platform.

## 🚀 Features

### For Candidates
- **User Registration & Authentication** - Secure account creation and login
- **Profile Management** - Complete profile setup with skills and experience
- **Job Search & Application** - Browse and apply for available positions
- **Application Tracking** - Monitor application status in real-time
- **Interview Management** - Schedule and track interview appointments
- **Dashboard** - Personalized candidate dashboard with statistics

### For Recruiters
- **Job Posting** - Create and manage job listings
- **Candidate Management** - Review and manage candidate applications
- **Interview Scheduling** - Coordinate interview sessions
- **Application Review** - Evaluate and process applications
- **Recruiter Dashboard** - Analytics and recruitment metrics

### For TalentHub Admin
- **System Overview** - Complete platform management
- **User Management** - Manage candidates and recruiters
- **Analytics** - Platform-wide statistics and insights
- **Notification System** - Real-time notifications

## 🛠️ Technology Stack

### Frontend
- **React.js** - Modern JavaScript library for building user interfaces
- **React Router** - Client-side routing
- **Bootstrap** - Responsive CSS framework
- **React Toastify** - Toast notifications




### Backend
- **RESTful API architecture** - API architecture
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MySQL** - SQL database 
- **JWT** - jsonwebtoken library
- **morgan,winston** -record log and error


## 📁 Project Structure

```
RecruitmentWeb/
├── backend/
│   ├── app.js                 # Main server application
│   ├── routes/               # API route handlers
│   │   ├── auth.js          # Authentication routes
│   │   ├── candidate.js     # Candidate management
│   │   ├── job.js           # Job management
│   │   ├── application.js   # Application handling
│   │   ├── interview.js     # Interview scheduling
│   │   ├── notification.js  # Notification system
│   │   └── talenthub.js     # Admin routes
│   ├── models/              # Database models
│   ├── middleware/          # Custom middleware
│   └── package.json         # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── Navbar.js    # Navigation component
│   │   │   └── ErrorBoundary.js # Error handling
│   │   ├── pages/           # Main page components
│   │   │   ├── Home.js      # Landing page
│   │   │   ├── Login.js     # User authentication
│   │   │   ├── Register.js  # User registration
│   │   │   ├── Dashboard.js # Main dashboard
│   │   │   ├── Profile.js   # User profile
│   │   │   ├── Jobs.js      # Job listings
│   │   │   ├── Applications.js # Application management
│   │   │   ├── Interviews.js   # Interview management
│   │   │   ├── CandidateDashboard.js
│   │   │   ├── RecruiterDashboard.js
│   │   │   ├── TalentHubDashboard.js
│   │   │   └── NotFound.js  # 404 page
│   │   ├── utils/           # Utility functions
│   │   ├── App.js           # Main application component
│   │   └── index.js         # Application entry point
│   ├── public/              # Static assets
│   ├── fix_all.sh          # Development utility script
│   └── package.json        # Frontend dependencies
│
└── README.md               # Project documentation
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RecruitmentWeb
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/talenthub
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

5. **Database Setup**
   - Ensure MongoDB is running on your system
   - The application will create necessary collections automatically

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The backend server will run on `http://localhost:3001`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   The frontend application will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Candidates
- `GET /api/candidate/profile` - Get candidate profile
- `PUT /api/candidate/profile` - Update candidate profile

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job (recruiters only)
- `GET /api/jobs/:id` - Get specific job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Applications
- `GET /api/applications` - Get applications
- `POST /api/applications` - Submit application
- `PUT /api/applications/:id` - Update application status

### Interviews
- `GET /api/interviews` - Get interviews
- `POST /api/interviews` - Schedule interview
- `PUT /api/interviews/:id` - Update interview

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Create notification

## 🎨 Key Features

### User Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (Candidate, Recruiter, Admin)
- Password encryption using bcrypt

### Real-time Notifications
- Toast notifications for user feedback
- System notifications for application updates

### Responsive Design
- Mobile-friendly interface
- Bootstrap-based responsive layout
- Cross-browser compatibility

### Date & Time Formatting
- Vietnamese locale support
- Consistent date/time display across the application

### Error Handling
- Comprehensive error boundary implementation
- API error handling with fallback data
- User-friendly error messages

## 🧪 Development Utilities

### Frontend Fix Script
The project includes a `fix_all.sh` script that provides:
- Utility functions for date formatting
- Status color mapping
- Error handling helpers
- Component structure setup


