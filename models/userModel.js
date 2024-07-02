const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    name: {type:String, required:true},
    email: {type:String, required:true},
    password: {type:String, required:true},
    avatar: {type:String, default: "default.jpg"},
    role: {type:String, default: "user"},
    posts: {type:Number, default: 0}
})

module.exports= model('User', userSchema)