// ===register new User
// POST = api/users/post
//Unprotected

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
const loginUsers = async (req, res, next) => {
  try{
      const {email, password} = req.body;
      if(!email || !password){
        return next(new HttpError("Field could not be empty",400));
      }

      const newEmail = email.toLowerCase();
      const emailExist = await User.findOne({ email: newEmail})

       if(!emailExist){
        return next(new HttpError(`${newEmail} is not registered, first register it`,400))
       }

       const comparePass = await bcrypt.compare(password, emailExist.password);
        if (!comparePass){
            return next(new HttpError("invalidpassword",400));
        }
        
        const {_id:id,name} = emailExist;

        const token = jwt.sign({id,name}, process.env.JWT_SECRET,{expiresIn: "1d"})
        res.status(200).json({token,id,name})
       }

  catch(error){
    return next(new HttpError("user login faile", 500));
  }
};

// ===user profile
// POST = api/users/userprofile
//protected
const getUser = async (req, res, next) => {
  res.json("get user information");
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
