const { Router } = require("express");
const multer = require('multer');
const path = require('path');

const Blog = require('../models/blog');
const Comment = require('../models/comment');


const router = Router();

//To store cover img
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //Save the cover img at destination
      //Create separate folder for every individual  
      cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
        //Create unique name
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
  });

const upload = multer({ storage: storage });  

router.get("/add-new", (req, res) => {
    return res.render("addBlog", {
      user: req.user,
    });
  });


//To render blog  
router.get("/:id", async (req,res) => {
   //To show which user created blog
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    //fetch comment
    const comments = await Comment.find({blogId:req.params.id }).populate("createdBy");
    //console.log("comments",comments);
    return res.render("blog",{
        user: req.user,
        blog,
        comments,
    });
});

//Handle Comment
router.post('/comment/:blogId', async (req,res) =>{
  //Creating Comment
  await Comment.create({
     content: req.body.content,
     blogId: req.params.blogId,
     createdBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);

});


//To create a blog full body
router.post('/', upload.single('coverImage'),async (req,res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    });
    //route to see blog
    return res.redirect(`/blog/${blog._id}`);
});

//Edit Blog -> will find that blog and redirect to editblog.ejs
router.get("/edit/:id", async (req,res) =>{
  try {
    const blog = await Blog.findById(req.params.id);
    if(!blog) return res.status(404).send("Blog Not Found");

    return res.render("editBlog", {
      user: req.user,
      blog, // Blog data passed here
      submit: "Save Changes",
      error: "An error occurred while updating the blog. Please try again!"
  });
  
  } catch (error) {
    console.error(error);
        return res.status(500).send('Error fetching blog');

  }
});

//Update Data of blog

router.post('/edit/:id', upload.single('coverImage'), async (req, res) => {
  try {
      const updatedData = {
          title: req.body.title,
          body: req.body.body,
          author: req.body.author,
          date: new Date().toISOString()
      };

      if (req.file) {
          updatedData.coverImageURL = `/uploads/${req.file.filename}`;
      }

      const blog = await Blog.findByIdAndUpdate(req.params.id, updatedData, { new: true });

      if (!blog) {
          return res.status(404).send('Blog not found');
      }

      return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
      console.error(error);
      return res.status(500).send('Error updating blog');
  }
});


 


module.exports = router;