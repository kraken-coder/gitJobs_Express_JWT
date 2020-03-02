const express = require('express');
const app = express();
const connectDB = require('./config/db');
//  connect database
connectDB();
// MiddleWare
app.use(express.json());
//  define routes
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
//  define routes middleware
app.use('/api/users', usersRoute);
app.use('/api/contacts', contactRoute);
app.use('/api/auth', authRoute);

// port and listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on ${PORT}`));
