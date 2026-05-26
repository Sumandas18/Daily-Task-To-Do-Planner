const express =  require('express')
const app = express()
const dataConnection = require('./app/config/db')
const cors = require('cors')

dataConnection()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// sob route gulo ekhane include kora hocche
const authRoutes = require('./app/routes/authRoutes');
const userRoutes = require('./app/routes/userRoutes');
const taskRoutes = require('./app/routes/taskRoutes');
const categoryRoutes = require('./app/routes/categoryRoutes');
const labelRoutes = require('./app/routes/labelRoutes');
const reminderRoutes = require('./app/routes/reminderRoutes');
const reportRoutes = require('./app/routes/reportRoutes');
const notificationRoutes = require('./app/routes/notificationRoutes');
const uploadRoutes = require('./app/routes/uploadRoutes');
const adminRoutes = require('./app/routes/adminRoutes');
const healthRoutes = require('./app/routes/healthRoutes');

// API prefixes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/labels', labelRoutes);
app.use('/api/v1/reminders', reminderRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/uploads', uploadRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/health', healthRoutes);

const port = process.env.PORT || 4001;

app.listen(port, (error) => {
    if (error) {
        console.log("Server start hote somossa hocche:", error);
    } else {
        console.log(`Server is running on port ${port}`);
    }
});