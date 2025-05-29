const mongoose = require('mongoose');
const { Schema, model } = mongoose;
//Import crypto for hashing of password
//-> createHmac hashes the password
const { createHmac } = require("crypto");
const { randomBytes } = require("crypto");
const { createTokenForUser } = require('../services/authentication');




//Collection
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    //Password Hashing
    //Salt and pepper hash
    salt: {
        type: String, 
    },
    password: {
        type: String,
        required: true,
    }, 
    profileImageURL: {
        type: String,
        //If user dont give pic
        default: '/images/avatar.png',

    },
    role: {
        type: String,
        //Can assign only these values
        enum: ["USER","ADMIN"],
        default:"USER",
    },
}, { timestamps: true }
);

//When user saves this schema a funtion will trigger
userSchema.pre('save', function (next) {
    //This is current user
    const user = this;

    if(!user.isModified('password')) return;
    
    //Salt is a random string
    const salt = randomBytes(16).toString();
    //pass sha256 algo to hash
    const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
    
    this.salt = salt;
    this.password = hashedPassword;
    next();
});

//Handle Signup
//Create function with name matchPassword
//This fn will return boolean
userSchema.static("matchPasswordAndGenerateToken",async function (email,password){
    //Find email of user 
    const user = await this.findOne({email});
    if (!user) throw new Error('User not found!');
    
    //Get salt of existing password and hashed pass
    const salt = user.salt;
    const hashedPassword =user.password;

    //Create hash for entered pass and compare
    const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

    if (hashedPassword !== userProvidedHash) throw new Error('Incorrect Password');
    
    //else return token
    const token =  createTokenForUser(user);
    return token;
});
//Creating Model
const User = model('user', userSchema);

module.exports = User;