// ===register new User
// POST = api/users/post
//Unprotected

const bcrypt = require('bcryptjs');

const User = require("../models/userModel");
const HttpError = require('../models/errorModel')

const registerUsers = async (req,res,next)=>{
    try {

        const {name,email,password,password2} = req.body;
        if (!name || !email || !password) {
            return next(new HttpError("fill in all fields"))
        }

        const newEmail = email.toLowerCase()

        const emailExists = await User.findOne({ email: newEmail })

        if (emailExists) {
            return next(new HttpError("email already exists", 409));
        }

        if (password.trim().length < 8) {
            return next(new HttpError("password should be at least 8 characters long", 400));
        }

        if (password != password2) {
            return next(new HttpError("passwords do not match", 400));
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)
        const newUser = await User.create({name, email: newEmail, password:hashedPass})
        res.status(201).json(newUser)
    
    } catch (error) {
        return next(new HttpError("user registration failed", 422));
    }
}


// ===Login new User
// POST = api/users/login
//Unprotected
const loginUsers = async (req,res,next)=>{
    res.json("login user")
}


// ===user profile
// POST = api/users/userprofile
//protected
const getUser = async (req,res,next)=>{
    res.json("get user information")
}


// ===change user Avatar
// POST = api/users/change-avatar
//protected
const changeAvatar = async (req,res,next)=>{
    res.json("change avatar")
}

// ===edit user details
// POST = api/users/edit-User
//protected
const editUser = async (req,res,next)=>{
    res.json("edit profile")
}


// ===get authors
// POST = api/users/authors
//protected
const getAuthors = async (req,res,next)=>{
    res.json("get authors details")
}


module.exports = {registerUsers, loginUsers, getUser, changeAvatar, editUser, getAuthors}




