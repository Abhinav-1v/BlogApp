const mongoose=require("mongoose");
const { createHmac,randomBytes, Hmac } = require("crypto");
const userschema=new mongoose.Schema({
    fullname:{
        Type:String,
        required:true
    },
    email:{
        Type:String,
        required:true
    },
    salt:{
        Type:String,
        required:true
    },
    password:{
        Type:String,
        required:true
    },
    profileimageurl:{
        Type:String,
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