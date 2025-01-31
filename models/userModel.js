const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    phone:{
        type:String,
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:['patient','admin'],
        default:'patient'
    }
},{timestamps:true}
)

module.exports = mongoose.model('patients',userSchema)