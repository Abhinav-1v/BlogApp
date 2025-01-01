const jwt=require("jsonwebtoken");

const secretkey="abhinav@10";

function settoken(user){
    return jwt.sign({
        _id:user._id,
        fullname:user.fullname,
        email:user.email,
        profileimageurl:user.profileimageurl,
        role:user.role
    },secretkey);
};

function checktoken(token){
    try{
        return jwt.verify(token,secretkey);
    }
    catch(e){
        return null;
    }
}

function authcheckermiddleware(req,res,next){
    const token=req.cookies?.token;
    if(token && checktoken(token)){
        const user=checktoken(token);
        return res.render("home",{user});
    }
    next();
}

module.exports={settoken,checktoken,authcheckermiddleware};