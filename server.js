require('dotenv').config();
const express = require('express');
const connectDB = require('./config/dbConnection');
const errorHandler = require('./middleware/errorhandler');
const authMiddleware = require('./middleware/authMiddleware');

const path = require('path');
const cookieParser = require('cookie-parser'); 
connectDB();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser()); 



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 
app.use(express.static(path.join(__dirname, '/css/style')));
app.use(express.static(path.join(__dirname, 'public')));



app.use('/blogposts',authMiddleware , require('./routes/Blog.Route'));
app.use('/users', require('./routes/users.Route'));
app.use('/',require('./routes/view.Route'))
app.use('/admin',require('./routes/admin.Route'))



app.use(errorHandler);


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});
