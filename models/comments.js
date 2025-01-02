const mongoose = require("mongoose");


const commentschema=mongoose.Schema({
    content:{ 
        type:String,
        required:true
    },
    createdby:{
        type:mongoose.Schema.ObjectId,
        ref:'users'
    },
    blogid:{
        type:mongoose.Schema.ObjectId,
        ref:'blogs'
    }
},{timestamps:true});

const COMM=mongoose.model('comments',commentschema);

module.exports=COMM;