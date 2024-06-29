const {Router} = require("express");
const router = Router();


const {registerUsers, loginUsers, getUser, changeAvatar, editUser, getAuthors} = require("../controllers/userControllers");

router.post("/register", registerUsers);

router.post("/login", loginUsers);

router.get("/:userId", getUser);

router.put("/:userId/avatar", changeAvatar);

router.put("/:userId", editUser);

router.get("/authors", getAuthors);

module.exports = router;