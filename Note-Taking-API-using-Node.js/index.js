const express = require('express');
const mongoose = require('mongoose');
const url = 'mongodb://0.0.0.0:27017/skillDb';
const { authRouter } = require('./routes/authRoutes'); // Import authRouter from authRoutes

const app = express();

mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;

con.on('open', () => {
    console.log('connected...');
});

// Middleware configuration
app.use(express.json());

// Importing route files
const noteRoutes = require('./routes/noteRoutes');

// Using route files
app.use('/auth', authRouter);

// Use noteRoutes for routes under /notes
app.use('/notes', noteRoutes);

app.listen(9000, () => {
    console.log('server started on port 9000...');
});
