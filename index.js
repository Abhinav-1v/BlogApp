const express=require("express");
const path=require("path");
const mongoose=require("mongoose");


const app=express();
const PORT=8008;
const userrouter=require('./routes/user');

mongoose.connect("mongodb://127.0.0.1:27017/blogapp").then(()=>console.log("MongoDB connected"));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use(express.urlencoded({extended:false}));


app.get('/',(req,res)=>{
    res.redirect('/user/signin');
})
app.get('/home',(req,res)=>{
    res.render("home");
});

app.use('/user',userrouter);




app.listen(PORT,()=>{console.log("Sever started at PORT: "+PORT)})