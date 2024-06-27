const {Router} = require("express");
const router = Router();

router.get("/", (req, res)=>{
    res.json("this is user route")
})


module.exports = router;