const mongoose=require("mongoose");
const { createHmac,randomBytes, Hmac } = require("crypto");
const { type } = require("os");
const userschema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    profileimageurl:{
        type:String,
        default:"/images/default.png"
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:"USER"
    }
},{timestamps:true});

userschema.pre('save',function(next){
    const user=this;
    if(!user.isModified("password")) return;
    const salt=randomBytes(16).toString();
    const hashedpassword=createHmac('sha256',salt).update(user.password)
    .digest('hex');

    this.salt=salt;
    this.password=hashedpassword;
    
    next();
});

const USER=mongoose.model('users',userschema);

module.exports=USER;