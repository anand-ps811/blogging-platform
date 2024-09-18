const asyncHandler = require('express-async-handler');
const Blog = require('../models/blog.model');

// Get all blogs
const getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find().populate('user_id', 'username').sort({ createdAt: -1 });;
    console.log('Fetching all blogs,', blogs);
    res.status(200).json(blogs); 
})


// Get blog by id
const getBlogs = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }
    res.status(200).json(blog);
});


// Create blog
const addBlog = asyncHandler(async (req, res) => {
    console.log('Adding a new blog with data:', req.body);
    const { title, body } = req.body;

    const user_id = req.user.id; 
    if (!user_id) {
        res.status(401);
        throw new Error("User not authenticated");
    }

    if (!title || !body) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    try {
        const newBlog = await Blog.create({
            user_id,
            title,
            body
        });
        res.status(201).json(newBlog);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Update blog
const updateBlog = asyncHandler(async (req, res) => {
    console.log('Updating blog with ID:', req.params.id);
    const { id } = req.params;
    const { title, body } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(id, { title, body }, { new: true });
    if (!updatedBlog) {
        res.status(404);
        throw new Error("Blog not found");
    }
    res.status(200).json(updatedBlog);
});

// Delete blog
const deleteBlog = asyncHandler(async (req, res) => {
    console.log('Deleting blog with ID:', req.params.id);
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
        res.status(404);
        throw new Error("Blog not found");
    }
    res.json({ message: "Blog deleted", blog: deletedBlog });
});

module.exports = {
    getBlogs,
    getAllBlogs,
    addBlog,
    updateBlog,
    deleteBlog
};
