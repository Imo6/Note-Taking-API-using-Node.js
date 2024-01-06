const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');


const isAuthenticated = async (req, res, next) => {
    console.log("req body:", req.body)
    const { userName } = req.body
    try {
        const user = await User.findOne({ userName })
        console.log("db user:",user)

        if (!user) {
            return res.status(401).send('user not found')
        }

        if (user.isLoggedIn != 1) {
            return res.status(401).send('user is not Login')
        }

        const tokenHeader = req.headers.authorization;
        // console.log("Headers:", req.headers);

        if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
            return res.status(401).send('Invalid token');
        }

        const token = tokenHeader.split(' ')[1];
        console.log("Token:", token);

        const jwtSecretKey = 'my_jwt_secret_key_qwertyuiopasdfghjklzxcvbnm1234567890';

        if (token) {
            jwt.verify(token, jwtSecretKey, (err, decoded) => {
                if (err) {
                    return res.status(401).send('Invalid token');
                } else {
                    // console.log("decoded:", decoded);
                    next();
                }
            });
        } else {
            return res.status(401).send('Token is missing');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

router.post('/register', async (req, res) => {
    try {
        const { userName, password } = req.body;
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: 'User with that userName already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            userName: userName,
            password: hashedPassword,
            isLoggedIn: 0
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
});

router.get('/login', async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        user.isLoggedIn = 1;
        await user.save();

        const jwtSecretKey = 'my_jwt_secret_key_qwertyuiopasdfghjklzxcvbnm1234567890';
        const token = jwt.sign({ userName: user._id, userName: user.userName }, jwtSecretKey, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
});

module.exports = {
    authRouter: router,
    isAuthenticated,
};