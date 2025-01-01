const {Router}=require("express");
const USER = require("../models/user");
const { createHmac } = require('crypto');
const { settoken, authcheckermiddleware } = require("../services/auth");
const path = require("path");

const router=Router();

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


router.post('/signup',async(req,res)=>{
    const {fullname,email,password}=req.body;
    await USER.create({
        fullname,
        email,
        password
    });
    return res.redirect('/user/signin');
});
router.get('/images/:pfpid',(req,res)=>{
    const pfpid=req.params.pfpid;
    return res.sendFile(path.resolve(`./public/images/${pfpid}`));
})
router.get('/signout',(req,res)=>{
    res.clearCookie('token');
    return res.redirect('/user/signin');
});

module.exports=router;

