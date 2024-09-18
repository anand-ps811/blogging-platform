
const express = require('express');
const { getBlogs, getAllBlogs, addBlog, updateBlog, deleteBlog } = require('../controllers/blog.controller');
const router = express.Router();

router.route('/').get(getAllBlogs).post(addBlog);
router.route('/:id').get(getBlogs).put(updateBlog).delete(deleteBlog);

module.exports = router;
