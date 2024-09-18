const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
    },
    email: {
        type: String, 
        required: true,
        unique: true,
    },
    password: {
        type: String,   
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const admin = mongoose.model('admin', adminSchema);

module.exports = admin;
