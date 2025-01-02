const { Router } = require("express");
const { checktoken } = require("../services/auth");
const multer =require("multer");
const path= require('path');
const router= Router();
const fs=require('fs');
const BLOG = require("../models/blog");
const COMM = require("../models/comments");


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
    const blog=await BLOG.create({
      title:body.title,
      body:body.body,
      coverimageurl:`/uploads/${user._id}/${req.file.filename}`,
      createdby:user._id
    });
    return res.render('addblog',{user,msg:"New Blog Created",blogid:blog._id})
});

router.get('/:blogid',async (req,res)=>{
  const token=req.cookies?.token;
    if(!token ||!checktoken(token)){
      return res.render('/user/signin');
    }
    const user=checktoken(token);
    const blogid=req.params.blogid;
    const blog=await BLOG.findOne({_id:blogid}).populate({path:"createdby",select:"fullname profileimageurl"});
    const comments=await COMM.find({blogid:blog._id}).populate({path:'createdby',select:"fullname"});
    return res.render('viewblog',{user,blog,comments});
})

router.get('/images/*',(req,res)=>{
    const blogpicid=req.params[0];
    return res.sendFile(path.resolve(`./public/${blogpicid}`));
});

router.post('/comment/:blogid',async (req,res)=>{
  const blogid=req.params.blogid;
  const token=req.cookies?.token;
  const user=checktoken(token);

  const content=req.body.content;
  await COMM.create({
    content,
    createdby:user._id,
    blogid
  });
  return res.redirect(`/blog/${blogid}`)
});

module.exports=router;