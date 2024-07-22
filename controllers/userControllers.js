// ===register new User
// POST = api/users/post
//Unprotected

const mongoose = require('mongoose');

const User = require("../models/userModel")
const HttpError= require("../models/errorModel");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUsers = async (req,res,next) => {
    try{
    const {name,email,password,password2}=req.body;

    if(!name || !email || !password || !password2){
       return next(new HttpError("please enter all the fields"),400);
    }

    if(password !== password2){
        return next(new HttpError("please enter the both password same"),400);
    }
    
    const newEmail = email.toLowerCase();
    const newExist = await User.findOne({email:newEmail});
    if(newExist){
        return next(new HttpError("User already existed",400));
    }

    if(password.trim().length<6){
        return next(new HttpError("please enter a little longer password",400));
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    const newUser= await User.create({
       name,
       email: newEmail,
       password: hashpassword
    })
    res.status(202).json(`${email} is registered`);
    }

    catch(error){
        return next(new HttpError("user registration failed", 500));
    }

}


// ===Login new User
// POST = api/users/login
//Unprotected
const loginUsers = async (req,res,next)=>{
try {
  const {email, password} = req.body;
  if(!email || !password){
    return next (new HttpError("please enter the empty field",400));
  }
  
  const newEmail= email.toLowerCase();
  const emailExists = await User.findOne({email: newEmail});
  if (!emailExists){
    return next(new HttpError("this email is not registered",400));
  }

  const comparepass = await bcrypt.compare(password,emailExists.password);
  if (!comparepass){
    return next(new HttpError("password doesnot match",400));
  }

  const {_id:id,name} = emailExists;
 const token = jwt.sign({id,name}, process.env.JWT_SECRET, {expiresIn:"1h"} )

 res.status(200).json({id, name, token});


  
} catch (error) {
  return next(new HttpError("invalid login",500));
}
}

// ===user profile
// POST = api/users/userprofile
//protected
const getUser = async (req, res, next) => {
  try {
       let {id} = req.params;

       id = id.trim();



       console.log("ID from request params:", id); // Debug: Log the ID
       if (!mongoose.Types.ObjectId.isValid(id)) {
         return next(new HttpError("Invalid user ID format", 403));
       }

       const user = await User.findById(id).select('-password');
       console.log("User Id found:",user);

       if (!user){
        return next(new HttpError("user not found",400));
       }
       res.status(200).json(user);
  }
  catch (error) {
    return next(new HttpError(error));
  }
};

// ===change user Avatar
// POST = api/users/change-avatar
//protected
const changeAvatar = async (req, res, next) => {
  res.json("change avatar");
};

// ===edit user details
// POST = api/users/edit-User
//protected
const editUser = async (req, res, next) => {
  res.json("edit profile");
};

// ===get authors
// POST = api/users/authors
//protected
const getAuthors = async (req, res, next) => {
  res.json("get authors detail");
};

module.exports = {
  registerUsers,
  loginUsers,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
};
