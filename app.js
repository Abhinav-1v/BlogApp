require('dotenv').config();

const express=require("express");
const path=require("path");
const mongoose=require("mongoose");
const cookieparser=require('cookie-parser');

const app=express();
const PORT=process.env.PORT || 8008;
const userrouter=require('./routes/user');
const blogrouter=require('./routes/blog');
const cookieParser = require("cookie-parser");
const {authcheckermiddleware, checktoken } = require("./services/auth");

mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/blogapp").then(()=>console.log("MongoDB connected"));
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.get('/',(req,res)=>{
    const token=req.cookies?.token;
    if(token && checktoken(token)){
        const user=checktoken(token);
        return res.render('welcome',{user});
    }
    return res.render('welcome');

})
app.get('/home',authcheckermiddleware,(req,res)=>{
    return res.redirect('user/signin');
});

app.use('/user',userrouter);
app.use('/blog',blogrouter);


app.get('/demo',(req,res)=>{
    return res.render('demo');
})

app.listen(PORT,'0.0.0.0',()=>{console.log("Server started at PORT: "+PORT)})