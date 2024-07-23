const {Router} = require("express");
const router = Router();


const {registerUsers, loginUsers, getUser, changeAvatar, editUser, getAuthors} = require("../controllers/userControllers");

router.post("/register", registerUsers);

router.post("/login", loginUsers);
router.get("/authors", getAuthors);

router.get("/:userId", getUser);

router.post("/change-avatar", changeAvatar);

router.patch("/:userId", editUser);


module.exports = router;