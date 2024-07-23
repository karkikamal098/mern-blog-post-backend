const {Router} = require("express");
const router = Router();


const {registerUsers, loginUsers, getUser, changeAvatar, editUser, getAuthors} = require("../controllers/userControllers");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUsers);

router.post("/login", loginUsers);
router.get("/authors", getAuthors);

router.get("/:userId", getUser);

router.post("/change-avatar",authMiddleware, changeAvatar);

router.patch("/edit-users",authMiddleware, editUser);


module.exports = router;