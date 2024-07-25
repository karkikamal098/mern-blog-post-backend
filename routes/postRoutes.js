const { Router } = require("express");
const router = Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createPost,
  getPosts,
  getPost,
  getCatPosts,
  getUserPosts,
  editPosts,
  delPosts,
} = require("../controllers/postControllers");

router.post("/", authMiddleware, createPost);
router.get("/", getPosts);
router.get("/:id", getPost);
router.get("/categories/:category", getCatPosts);
router.patch("/:id", authMiddleware, editPosts);
router.get("/user/:id", getUserPosts);
router.delete("/:id", authMiddleware, delPosts);

module.exports = router;
