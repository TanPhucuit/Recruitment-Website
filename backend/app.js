const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'TalentHub API is running!' });
});

// Import routes
const authRoutes = require('./routes/auth');
const candidateRoutes = require('./routes/candidate');
const jobRoutes = require('./routes/job');
const testRoutes = require('./routes/test');
const applicationRoutes = require('./routes/application');
const interviewRoutes = require('./routes/interview');
const notificationRoutes = require('./routes/notification');
const talenthubRoutes = require('./routes/talenthub');

app.use('/api/auth', authRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/talenthub', talenthubRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 