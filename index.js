const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookiePaser = require('cookie-parser');

const Blog = require('./models/blog');


const app = express();
const PORT =8000;
//import routes
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

//Add middleware
//use ejs as template language
app.set('view engine','ejs' );

//path to ejs files
app.set('views', path.resolve("./views"));
//To include HTML and handle forms 
app.use(express.urlencoded({ extended: false}));

//Use middlewares
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));

//Connect mongoDB
mongoose.connect('mongodb://localhost:27017/blogify').then((e) => console.log("MongoDB Connected"));


app.get("/",async (req,res) =>{
    //To render blogs
    const allBlogs = await Blog.find({});
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});

//Use userROute if any req start from /user
app.use('/user',userRoute);

app.use('/blog',blogRoute);

//TO Start server
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));