const { Router } = require("express");
const { checktoken } = require("../services/auth");
const multer =require("multer");
const path= require('path');
const router= Router();
const fs=require('fs');
const BLOG = require("../models/blog");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const token = req.cookies?.token;
    const user = checktoken(token);
    const userDir = path.resolve(`./public/uploads/${user._id}`);

    fs.mkdir(userDir, { recursive: true }, () => {
      // Ignoring potential errors to proceed
      cb(null, userDir);
    });
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload=multer({storage});

router.get('/addblog',(req,res)=>{
    const token=req.cookies?.token;
    if(!token || !checktoken(token)){
      return res.redirect('/user/signin');
    }
    const user=checktoken(token);
    return res.render('addblog',{user});
});

router.post('/addblog',upload.single('coverimageurl'),async (req,res)=>{
    const token=req.cookies?.token;
    if(!token ||!checktoken(token)){
      return res.render('/user/signin');
    }
    const user=checktoken(token);
    const body=req.body;
    await BLOG.create({
      title:body.title,
      body:body.body,
      coverimageurl:`/uploads/${user._id}/${req.file.filename}`,
      createdby:user._id
    });
    return res.render('addblog',{user,msg:"New Blog Created"})
});

module.exports=router;