const Post = require("../models/postModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const fs = require("fs");
const { v4: uuid } = require("uuid");

const HttpError = require("../models/errorModel");

const jwt = require("jsonwebtoken");
require("dotenv").config();

// Create a post
//POST: api/posts
//protected
const createPost = async (req, res, next) => {
  try {
    const { title, category, description, author } = req.body;
    if (!title || !category || !description || !author) {
      return next(new HttpError("don't let any field empty",403));
    }

    const { thumbnail } = req.files;
    //checking the filesize
    if (thumbnail.size > 200000) {
      return next(new HttpError("file size is too large", 400));
    }

    let filename = thumbnail.name;
    let splittedName = filename.split(".");
    const photoName =
      splittedName[0] + uuid.v4() + splittedName[splittedName.length - 1];

    //move the file to public/uploads folder
    thumbnail.mv(
      path.join("__dirname", "..", "/uploads", photoName),
      async (err) => {
        if (err) {
          return next(new HttpError("Failed to upload the file", 500));
        } else {
          //creating a new post with thumbnail path
          const newPost = await Post.create({
            title,
            category,
            description,
            author,
            thumbnail: photoName,
            creater: req.user.id,
          });
          if (!newPost) {
            return next(new HttpError("Failed to create post", 500));
          }
          //count the post of the users
          let postCount = await User.findOne(req.user.id);
          const userPostCount = postCount + 1;
          await User.findByIdAndUpdate(req.user.id, {
            postCount: userPostCount,
          });
        }
      }
    );

    res.staus(200).json("create posted successfully");
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

//get all post
//POST: api/posts
//UNprotected
const getPosts = async (req, res, next) => {
  res.json("Get All post");
};

// GET SINGLE POST
//GET: api/posts/:id
//unprotected
const getPost = async (req, res, next) => {
  res.json("Get single post");
};

// Get Posts by category
//GET: api/posts/categories/:category
//UNprotected
const getCatPosts = async (req, res, next) => {
  res.json("Get posts by category");
};

// Get Authors Posts
//GET: api/posts/users/:id
//UNprotected
const getUserPosts = async (req, res, next) => {
  res.json("These are the post of the users.");
};

// EDIT POSTS
//GET: api/posts/:id
//protected
const editPosts = async (req, res, next) => {
  res.json("Post edited");
};

// DELETE POSTS
//DELETED: api/:id
//protected
const delPosts = async (req, res, next) => {
  res.json("post is deleted");
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getCatPosts,
  getUserPosts,
  editPosts,
  delPosts,
};
