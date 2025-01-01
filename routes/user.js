const {Router}=require("express");
const USER = require("../models/user");
const { createHmac } = require('crypto');


const router=Router();

router.get('/signin',(req,res)=>{
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
        return res.render('signin',{msg:1});
    }
    const checkhashpassword=createHmac('sha256',loggeduser.salt).update(password).digest('hex');
    if(checkhashpassword===loggeduser.password){
        return res.redirect('/home');
    }
    else{
        return res.render('signin',{msg:2});
    }
});


router.post('/signup',async(req,res)=>{
    const {fullname,email,password}=req.body;
    await USER.create({
        fullname,
        email,
        password
    });
    return res.redirect('/home');
});

module.exports=router;

