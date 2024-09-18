const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
 
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    if (newUser) {
        res.redirect('/login').status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
        });


    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            { user: { id: user._id, username: user.username, email: user.email } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30m" }
        );
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 60 * 1000 
        });
        // Redirect to blog page after successful login
        res.redirect('/home');
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

const currentUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});



const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}, 'username');
    res.status(200).json(users);
});


module.exports = { registerUser, loginUser, currentUser, getAllUsers };
