const express = require('express')
const viewController = require('../controllers/view.controller')
const authMiddleware = require('../middleware/authMiddleware')
const validateToken = require('../middleware/validateTokenHandler')
const adminMiddleware = require('../middleware/adminMiddleware')

const router = express.Router();

router.get('/login', viewController.renderLogin);
router.get('/register', viewController.renderRegister);
router.get('/blogs',authMiddleware,viewController.renderblog)
router.get('/home',authMiddleware,viewController.renderhome)
router.get('/my-posts', authMiddleware,viewController.renderMyPosts); 
router.get('/user-posts/:id', authMiddleware,viewController.renderUserPosts); 
router.get('/edit-post/:id', authMiddleware,viewController.renderEditPosts); 
router.get('/edit-userpost/:id',viewController.renderEditUserPosts); 
router.get('/adminLogin', viewController.renderAdminLogin);
router.get('/adminHome',authMiddleware, adminMiddleware,viewController.renderAdminHome);



module.exports = router;