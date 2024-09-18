const mongoose = require('mongoose');
const { Schema } = require('./user.model'); 

const blogSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User", 
    },
    title: {
        type: String,
        required: [true, "Please add the title"],
    },
    body: {
        type: String,
        required: [true, "Please add the body of the blog"],
    },
    
},{ timestamps: true ,collection: 'posts'});



module.exports = mongoose.model("Post", blogSchema);
