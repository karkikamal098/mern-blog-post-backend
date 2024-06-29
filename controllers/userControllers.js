// ===register new User
// POST = api/users/post
//Unprotected
const registerUsers = (req,res,next)=>{
    res.json("register users")
}


// ===Login new User
// POST = api/users/login
//Unprotected
const loginUsers = (req,res,next)=>{
    res.json("login user")
}


// ===user profile
// POST = api/users/userprofile
//protected
const getUser = (req,res,next)=>{
    res.json("get user information")
}


// ===change user Avatar
// POST = api/users/change-avatar
//protected
const changeAvatar = (req,res,next)=>{
    res.json("change avatar")
}

// ===edit user details
// POST = api/users/edit-User
//protected
const editUser = (req,res,next)=>{
    res.json("edit profile")
}


// ===get authors
// POST = api/users/authors
//protected
const getAuthors = (req,res,next)=>{
    res.json("get authors details")
}


module.exports = {registerUsers, loginUsers, getUser, changeAvatar, editUser, getAuthors}




