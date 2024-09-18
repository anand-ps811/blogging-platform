const Blog = require('../models/blog.model');
const user = require('../models/user.model');
const admin = require('../models/admin.model')
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');


const renderLogin = (req, res) => {
    res.render('login')
}
const renderRegister = (req, res) => {
    res.render('register')
}

const renderblog = (req, res) => {
    res.render('blogs')
}

const renderAdminLogin = (req, res) => {
    res.render('adminLogin')
}
const renderAdminHome = (req, res) => {
    res.render('adminHome')
}


const renderhome = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('user_id', 'username');
        console.log('Blogs fetched:', blogs);
        const reversedBlog= [...blogs].reverse();
        res.render('home', { blogs });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
const renderMyPosts = asyncHandler(async (req, res) => {
    try {
        const userToken = req.cookies?.token;
        console.log("User token:", userToken);

        if (!userToken) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        let decoded;
        try {
            decoded = jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded.user;
            console.log("Decoded user:", req.user);
        } catch (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({ message: 'Token is not valid' });
        }

        const userId = req.user.id; 
        const posts = await Blog.find({ user_id: userId }).populate('user_id', 'username');
        console.log("User posts:", posts);
        res.render('myPosts', { posts });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).send('Server Error');
    }
});
const renderUserPosts = asyncHandler(async (req, res) => {
    try {
        const userToken = req.cookies?.token;
        console.log("User token:", userToken);

        if (!userToken) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        let decoded;
        try {
            decoded = jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded.user;
            console.log("Decoded user:", req.user);
        } catch (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({ message: 'Token is not valid' });
        }

        const userId = req.params.id;
        console.log("Fetching posts for user ID:", userId);

        const posts = await Blog.find({ user_id: userId }).populate('user_id', 'username');
        console.log("User posts:", posts);
        res.render('posts', { posts });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).send('Server Error');
    }
});
const renderEditPosts = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const post = await Blog.findById(postId);
    if (!post) {
        return res.status(404).send('Post not found');
    }
    res.render('editPosts', { post });
});
const renderEditUserPosts = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const post = await Blog.findById(postId);
    if (!post) {
        return res.status(404).send('Post not found');
    }
    res.render('editUserPost', { post });
});
module.exports = { renderLogin, renderRegister, renderblog, renderhome, renderMyPosts, renderEditPosts, renderAdminLogin, renderAdminHome, renderUserPosts ,renderEditUserPosts}