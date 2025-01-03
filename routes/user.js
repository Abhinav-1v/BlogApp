const {Router}=require("express");
const USER = require("../models/user");
const { createHmac } = require('crypto');
const { settoken, authcheckermiddleware, checktoken } = require("../services/auth");
const multer =require("multer");
const path = require("path");

const router=Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userDir = path.resolve(`./public/images/`);  
        cb(null, userDir);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload=multer({storage});

router.get('/signin',authcheckermiddleware,(req,res)=>{
    res.render("signin");
})

router.get('/signup',(req,res)=>{
    res.render('signup');
})
router.post('/signin',async(req,res)=>{
    const {email,password}=req.body;
    const loggeduser=await USER.findOne({
        email
    });
    if(!loggeduser){
        return res.render('signin',{error:"Incorrect Email or Password"});
    }
    const checkhashpassword=createHmac('sha256',loggeduser.salt).update(password).digest('hex');
    if(checkhashpassword!==loggeduser.password){
        return res.render('signin',{error:"Incorrect Email or Password"});
    }
    const token=settoken(loggeduser);
    res.cookie('token',token);
    return res.redirect('/home');
});


router.post('/signup',upload.single('profileimageurl'),async(req,res)=>{
    const {fullname,email,password}=req.body;
    await USER.create({
        fullname,
        email,
        password,
        profileimageurl:`/images/${req.file?req.file.filename:'default.png'}`
    });
    return res.redirect('/user/signin');
});

router.get('/images/:pfpid',(req,res)=>{
    const pfpid=req.params.pfpid;
    return res.sendFile(path.resolve(`./public/images/${pfpid}`));
});

router.get('/signout',(req,res)=>{
    res.clearCookie('token');
    return res.redirect('/user/signin');
});

router.get('/upfp',(req,res)=>{
    const token=req.cookies?.token;
    const user=checktoken(token);
    return res.render('changepfp',{user});
});

router.post('/upfp',upload.single('profileimageurl'),async (req,res)=>{
    const token=req.cookies?.token;
    const user=checktoken(token);
    const updateduser= await USER.findOneAndUpdate({_id:user._id},{profileimageurl:`/images/${req.file.filename}`},{new:true});
    const newtoken=settoken(updateduser);
    res.cookie('token',newtoken);
    return res.redirect('/home');
});

module.exports=router;

