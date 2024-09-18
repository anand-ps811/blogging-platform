const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const blogs = require('../models/blog.model');

const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are mandatory!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isAdmin) {
        return res.status(403).json({ message: "You are not authorized to access this page" });
    }

    const accessToken = jwt.sign(
        { user: { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
    );

    res.cookie('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 60 * 1000
    });

    res.status(200).json({ message: 'Login successful' });
});
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({}, 'username _id');
        res.render('adminhome', { users });
    } catch (error) {
        res.status(500).send('Error fetching users');
    }
});


const editUserPage = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('editUsers', { user });
    } catch (error) {
        res.status(500).send('Error fetching user');
    }
});




const updateUser = asyncHandler(async (req, res) => {
   
    console.log('User ID:', req.params.id);
   
    const userId = req.params.id;
    const { username, email } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { username, email }, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.redirect('/admin/adminHome');
    } catch (error) {
        res.status(500).send('Error updating user');
    }
});


const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).send('User not found');
        }
        res.status(200).send('User deleted successfully!');
    } catch (error) {
        res.status(500).send('Error deleting user');
    }
});

const getUserPosts = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    console.log('Fetching posts for user ID:', userId); 

    try {
 
        const posts = await blogs.find({ user_id: userId }); 

        if (!posts) {
            return res.status(404).send('No posts found for this user.');
        }

        res.render('userPosts', { posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Error fetching posts');
    }
});



module.exports = { getAllUsers, editUserPage,adminLogin,updateUser,deleteUser,getUserPosts };
