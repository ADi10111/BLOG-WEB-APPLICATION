const { Router } = require("express");
const User = require('../models/user');

const router = Router();

//route for signin
router.get("/signin", (req,res) => {
    return res.render("signin");
});
//route for signup
router.get("/signup", (req,res) => {
    return res.render("signup");
});

// Route for home
router.get("/home", (req, res) => {
    res.redirect("/"); // Render the home.ejs file
});



//Handing wrong login
router.post('/signin', async (req,res) => {
    const {email, password } = req.body;
    try {
        const token= await User.matchPasswordAndGenerateToken(email,password);
        //if password is correct cookie is genetaed with token 
        return res.cookie("token",token).redirect("/");
    } catch (error) {
        //if pass is wrong return to login page
        return res.render("signin", {
            error: "Incorrect Email or Password",
        });
    }

});

//To handle signup
router.post("/signup", async (req,res) => {
    //get details from signup
    const {fullName, email, password } = req.body;
    //To create a new user
    await User.create({
        fullName,
        email,
        password,
    });
    //redirect user to homepage after signup
    return res.redirect("/signin");
});

//Route for logout
router.get('/logout', (req,res) => {
    res.clearCookie('token').redirect('/');
});

module.exports = router;
