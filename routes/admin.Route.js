const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getAllUsers,
  editUserPage,
  updateUser,
  deleteUser,
} = require('../controllers/admin.controller');
const adminMiddleware = require('../middleware/adminMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/adminLogin', adminLogin);
router.get('/adminHome', authMiddleware, adminMiddleware, getAllUsers);
router.get('/edit/:id', authMiddleware, adminMiddleware, editUserPage);
router.post('/update/:id', authMiddleware, adminMiddleware, updateUser);
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteUser);

// Logout route
router.get('/logout', (req, res) => {
  console.log('Logout request received');
  res.clearCookie('token', { path: '/' });
  res.redirect('/adminLogin');
});

module.exports = router;
