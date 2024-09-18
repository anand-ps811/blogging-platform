const express = require('express');
const router = express.Router();
const { registerUser, loginUser, currentUser, getAllUsers} = require('../controllers/user.controller');
const validateToken = require('../middleware/validateTokenHandler');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/current', validateToken, currentUser); 
router.get('/', getAllUsers); 

router.get('/logout', (req, res) => {
    console.log('Logout request received');
    res.clearCookie('token', { path: '/' });
    res.redirect('/login');

});

module.exports = router;
