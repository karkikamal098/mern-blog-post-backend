const Post = require("../models/postModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/errorModel");

const jwt = require("jsonwebtoken");
require("dotenv").config();

// Create a post
//POST: api/posts
//protected
const createPost = async (req, res, next) => {
  try {
    const {title, category, description } = req.body;
    if (!title || !category || !description) {
      return next(new HttpError("don't let any field empty", 403));
    }

    // const { thumbnail } = req.files;
    // //checking the filesize
    // if (thumbnail.size > 200000) {
    //   return next(new HttpError("file size is too large", 400));
    // }

    // let filename = thumbnail.name;
    // let splittedName = filename.split(".");
    // const photoName =
    //   splittedName[0] + uuid.v4() + splittedName[splittedName.length - 1];

    // //move the file to public/uploads folder
    // thumbnail.mv(
    //   path.join("__dirname", "..", "uploads", photoName),
    //   async (err) => {
    //     if (err) {
    //       return next(new HttpError("Failed to upload the file", 500));
    //     } else {
          //creating a new post with thumbnail path
          const newPost = await Post.create({
            title,
            category,
            description,
            creator: req.user.id,
          });
          if (!newPost) {
            return next(new HttpError("Failed to create post", 500));
          }
          //count the post of the users
          let postCount = await User.findOne(req.user.id);
          let userPostCount = postCount + 1;
          await User.findByIdAndUpdate(req.user.id, {
            postCount: userPostCount,
          });
       
    res.staus(200).json("create posted successfully");
    }
    catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

//get all post
//POST: api/posts
//UNprotected
const getPosts = async (req, res, next) => {
  try {
    const allPosts = await Post.find().sort({ updatedAt: -1 });
    if (!allPosts) {
      return next(new HttpError("No posts found", 404));
    }
    res.status(200).json(allPosts);
  } catch {
    return next(new HttpError(error.message));
  }
};

// GET SINGLE POST
//GET: api/posts/:id
//unprotected
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }

    res.status(200).json();
  } catch {
    return next(new HttpError("Post not found", 404));
  }
};

// Get Posts by category
//GET: api/posts/categories/:category
//UNprotected
const getCatPosts = async (req, res, next) => {
  try {
    const { category } = await req.query;
    if (!category) {
      return next(new HttpError("you need to choose category", 400));
    }

    const catPosts = await Post.find({ category });
    if (!catPosts) {
      return next(new HttpError("No posts found in this category", 404));
    }
    res.status(200).json(catPosts);
  } catch (error) {
    return next(new HttpError("Post not found", 404));
  }
};

// Get Authors Posts
//GET: api/posts/users/:id
//UNprotected
const getUserPosts = async (req, res, next) => {
  try {
    const userPost = await Post.findById(req.user.id);
    if (req.params.id === req.user.id) {
      res.status(200).json({ title: title, category: category, description });
    }
  } catch {
    return next(new HttpError("User not found", 404));
  }
};

// EDIT POSTS
//GET: api/posts/:id
//protected
const editPosts = async (req, res, next) => {
  try {
    const { title, category, description } = await User.findById(req.id);
    if (!title || !category || !description) {
      return next(new HttpError("post not found", 404));
    }

    const post = await Post.findById(req.Post.id);
    if (!post) {
      return next(new HttpError("post not found", 404));
    }

    if (post.creator.toString() !== req.user.id) {
      return next(
        new HttpError("You are not authorized to edit this post", 403)
      );
    }

    const updatedPost = await post.findByIdAndUpdate(req.post.id, {
      title,
      category: req.post.category,
      description: req.post.description,
    });

    if (!updatedPost) {
      return next(new HttpError("Post not found or failed to update.", 404));
    }

    res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch {
    next(new HttpError(error.message, 500));
  }
};

// DELETE POSTS
//DELETED: api/:id
//protected
const delPosts = async (req, res, next) => {
  try {
    const postId = req.params.id;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }

    // Check if the user is authorized to delete the post
    if (post.creator.toString() !== req.user.id) {
      return next(
        new HttpError("You are not authorized to delete this post", 403)
      );
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    // Update the user's post count
    const user = await User.findById(req.user.id);
    if (user) {
      user.postCount -= 1;
      await user.save();
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
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
