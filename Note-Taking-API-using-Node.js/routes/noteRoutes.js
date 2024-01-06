const express = require('express');
const User = require('../models/noteSchema');
const { authRouter, isAuthenticated } = require('../routes/authRoutes')

const router = express.Router();

router.use(authRouter);
router.use(isAuthenticated);

router.post('/user',isAuthenticated, async (req, res) => {
    console.log("body: ",req.body)
    const user= new User({
        userName: req.body.userName,
        password: req.body.password,
        notes: req.body.notes,
        isLoggedIn: req.body.isLoggedIn,
    });
    console.log(`userName: ${user.userName},password: ${user.password},notes: ${user.notes},isLoggedIn: ${user.isLoggedIn}`)
    
    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({ message: 'Error while creating user', error: err.message });
    }
});

router.get('/user',isAuthenticated, async (req, res) => {
    const userName= req.body
    try {
        const user = await User.findOne(userName);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user by ID', error: err.message });
    }
});

router.put('/user',isAuthenticated, async (req, res) => {
    // console.log("put req body:", req.body)
    const { userName, notes }= req.body
    try {
        const {_id } = await User.findOne({userName});
        // console.log(`put user: ${_id}`)
        const updatedUser = await User.findOneAndUpdate(
            { _id: _id },
            {
                userName: userName,
                notes: notes,
            },
            { new: true }
        );

        res.json({ message: 'User notes updated successfully', updatedUser});
    } catch (err) {
        res.status(500).json({ message: 'Error updating user notes', error: err.message });
    }
});

router.delete('/user',isAuthenticated, async (req, res) => {
    try {
        const { userName } = req.body
        const deletedUser = await User.deleteOne({ userName });
        if (deletedUser.deletedCount > 0) {
            res.json({ message: 'User notes deleted successfully', deletedUser });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
});

module.exports = router;

