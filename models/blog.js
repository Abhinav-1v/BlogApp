const mongoose = require("mongoose");


const blogschema=mongoose.Schema({
    title:{ 
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true,
    },
    coverimageurl:{
        type:String,
        required:false,
    },
    createdby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }
},{timestamps:true});

const BLOG=mongoose.model('blogs',blogschema);

module.exports=BLOG;