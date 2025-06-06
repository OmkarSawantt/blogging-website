const User=require('../models/userModel')
const jwt=require('jsonwebtoken')
const HttpError = require("../models/errorModel")
const bcrypt=require('bcryptjs')
const fs=require('fs')
const path=require('path')
const {v4:uuid}=require("uuid")

//Register post:api/users/register
const registerUser= async(req,res,next)=>{
    try {
        const {name,email,password,password2}=req.body;

        if(!name || !email || !password){
            return next(new HttpError("Fill in all fields.",422))
        }
        const newEmail=email.toLowerCase()
        const emailExixts=await User.findOne({email:newEmail})
        if(emailExixts){
            return next(new HttpError("Email Already Exists",422))
        }
        if((password.trim()).length<6){
            return next(new HttpError("Password should be atleast 6 characters",422))
        }
        if(password != password2){
            return next(new HttpError("Password do not match",422))
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass=await bcrypt.hash(password,salt);
        const defaultAvatarUrl = process.env.DEFAULT_AVATAR_URL;
        const newUser=await User.create({name,email:newEmail,password:hashedPass,avatar: defaultAvatarUrl,})
        res.status(201).json(`New User ${newUser.email} registered.`)

    } catch (error) {
        return next(new HttpError("User registration failed.",422))
    }
}

//Login post:api/users/login unprotected
const loginUser= async (req,res,next)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return next(new HttpError("Fill in all the details.",422))
        }
        const newEmail=email.toLowerCase();
        const user=await User.findOne({email:newEmail})
        if(!user){
            return next(new HttpError("User not found.",422))
        }
        const comparePass=await bcrypt.compare(password,user.password)
        if(!comparePass){
            return next(new HttpError("Invalid Password.",422))
        }

        const {_id:id,name}=user;
        const token=jwt.sign({id,name},process.env.JWT_SECRET,{expiresIn:"1d"})
        res.status(200).json({token,id,name})
    }catch(error){
        return next(new HttpError("Login failed.Please Check the credentials.",422))
    }
}

//User Profile  post:api/users/:id    protected
const getUser= async (req,res,next)=>{
    try {
        const {id}=req.params;
        const user=await User.findById(id).select('-password');
        if(!user){
            return next(new HttpError("User not found",404))
        }
        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError(error))
    }
}




//Change User Avatar  post:api/users/change-avatar   protected
const changeAvatar = async (req, res, next) => {
    try {

      const user = await User.findById(req.user.id);
      const { avatar } =req.body;
      console.log(avatar);
      const updatedAvatar = await User.findByIdAndUpdate(req.user.id, { avatar: avatar }, { new: true });
      if (!updatedAvatar) {
        return next(new HttpError("Avatar couldn't be changed.", 422));
      }
      res.status(200).json(updatedAvatar);
    } catch (error) {
      console.log(error);
      return next(new HttpError(error));
    }
  };


//Edit User Detail  post:api/users/edit-user    protected
const editUser= async (req,res,next)=>{
    try {
        const {name,email,currentPassword,newPassword,confirmNewPassword} =req.body;
        if(!name || !email || !currentPassword || !newPassword){
            return next(new HttpError("Fill in all fields.",422))
        }
        const user=await User.findById(req.user.id);
        if(!user){
            return next(new HttpError("User not found.",403))
        }
        const emailExists=await User.findOne({email});
        if(emailExists && (emailExists._id!=req.user.id)){
            return next(new HttpError("Email already exist.",422))
        }
        const validateUserPassword=await bcrypt.compare(currentPassword,user.password);
        if(!validateUserPassword){
            return next(new HttpError("Invalid Current password",422))
        }
        if(newPassword !== confirmNewPassword){
            return next(new HttpError("New passwords do not match.",422))
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass=await bcrypt.hash(newPassword,salt);

        const newInfo=await User.findByIdAndUpdate(req.user.id,{name,email,password:hashedPass},{new:true})
        res.status(200).json(newInfo)
    } catch (error) {
        return next(new HttpError(error))
    }
}

//Get Authors  post:api/users/:authors   protected
const getAuthors= async (req,res,next)=>{
    try {
        const authors= await User.find().select('-password');
        res.json(authors);
    } catch (error) {
        return next(new HttpError(error))
    }
}


module.exports={registerUser,loginUser,getUser,changeAvatar,editUser,getAuthors}
