// ===register new User
// POST = api/users/post
//Unprotected

const mongoose = require("mongoose");

const User = require("../models/userModel");
const HttpError = require("../models/errorModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');


const registerUsers = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;

    if (!name || !email || !password || !password2) {
      return next(new HttpError("please enter all the fields"), 400);
    }

    if (password !== password2) {
      return next(new HttpError("please enter the both password same"), 400);
    }

    const newEmail = email.toLowerCase();
    const newExist = await User.findOne({ email: newEmail });
    if (newExist) {
      return next(new HttpError("User already existed", 400));
    }

    if (password.trim().length < 6) {
      return next(new HttpError("please enter a little longer password", 400));
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email: newEmail,
      password: hashpassword,
    });
    res.status(202).json(`${email} is registered`);
  } catch (error) {
    return next(new HttpError("user registration failed", 500));
  }
};

// ===Login new User
// POST = api/users/login
//Unprotected
const loginUsers = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError("please enter the empty field", 400));
    }

    const newEmail = email.toLowerCase();
    const emailExists = await User.findOne({ email: newEmail });
    if (!emailExists) {
      return next(new HttpError("this email is not registered", 400));
    }

    const comparepass = await bcrypt.compare(password, emailExists.password);
    if (!comparepass) {
      return next(new HttpError("password doesnot match", 400));
    }

    const { _id: id, name } = emailExists;
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ id, name, token });
  } catch (error) {
    return next(new HttpError("invalid login", 500));
  }
};

// ===user profile
// POST = api/users/userprofile
//protected
const getUser = async (req, res, next) => {
  try {
    const {userId} = req.params;
    
    const user = await User.findById(userId).select("-password");

    if(!user){
      return next(new HttpError("user not found", 404));
    }
    res.status(200).json({user});
    
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
}


// ===change user Avatar
// POST = api/users/change-avatar
//protected
const changeAvatar = async (req, res, next) => {
  try {
     
    //files from field
     if(!req.files.avatar){
      return next(new HttpError("file not found, please choose the file", 404));
     }

    //files from the database
    const user= await User.findById(req.user.id);
    if(!user){
      return next(new HttpError("User not found", 404));
    }

   

    //delete the old avatar
    if(user.avatar){
      const avatarPath =fs.unlink(path.join(__dirname, "..", "uploads", user.avatar),(err) => {
        if(err){
        return next(HttpError(err));
        }
      });
    }

    const {avatar} = req.files;
  //check the file size
    if (avatar.size.length>50){
      return next(new HttpError("file size is too large", 413));
    }

    //create new avatar name
    const avatarName= avatar.name;
    const splitName= avatarName.split(".");
    const changedAvatarName= splitName[0]+ uuidv4() + splitName[split.length-1];

   

    //add new avatar to the database
   avatar.mv(path.join(__dirname, "..", "uploads",changedavatarname),(err)=>{
      if(err){
        return next(HttpError(err));
      }
    });
    
    const updatedAvatar = await User.findByIdAndUpdate(req.user.id, {avatar: changedAvatarName}, {update:true});
    if(!updatedAvatar){
      return next(new HttpError("avatar not updated", 404));
    }

    res.status(200).json(updatedAvatar);

      
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

// ===edit user details
// POST = api/users/edit-User
//protected
const editUser = async (req, res, next) => {
   try {
    
   } catch (error) {
    
   }
};

// ===get authors
// POST = api/users/authors
//protected
const getAuthors = async (req, res, next) => {
  try {
    const authors = await User.find().select("-password");
    console.log("Authors found:", authors);

    res.status(200).json(authors);
    
  } catch (error) {
    console.error("Error fetching authors", error); //log the error
    return next(new HttpError(error));
  }
};

module.exports = {
  registerUsers,
  loginUsers,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
};
