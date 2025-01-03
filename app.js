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
    const token=req.cookies?.token;
    const user=checktoken(token);
    return res.render('demo',{user,blogs:[{
        title: '1213',
        body: '131313',
        coverimageurl: '/uploads/67757ff4d4df0a5ae1cd06e4/1735835934273-drivelink.txt',
        createdby: {
            fullname:'Abhinav Verma'
        },
        _id: `new ObjectId('6776c11ed91f948e511e1f82')`,
        createdAt: '2025-01-02T16:38:54.286Z',
        updatedAt: '2025-01-02T16:38:54.286Z',
        __v: 0
      }]});
})

app.listen(PORT,()=>{console.log("Sever started at PORT: "+PORT)})