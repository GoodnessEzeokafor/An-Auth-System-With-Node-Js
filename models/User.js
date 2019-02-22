const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema


// create instance of mongoose schema


var userSchema = new Schema({
    username:{
        type:String,
        index:true
    },
    password:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    name:{
        type:String
    },
    profileImage:{
        type:String
    }
})

const User = mongoose.model('User', userSchema)


module.exports = User
