const User=require('../models/User');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const { Op } = require("sequelize");

const register=async (req,res)=>{
    const {name,email,password}=req.body;
    try {
        const user=await User.create({name,email,password});
        res.status(201).json({success:true,message:'User created successfully',data:user});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const login=async (req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await User.findOne({where:{email}});
        if(!user){
            return res.status(404).json({success:false,message:'User not found'});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({success:false,message:'Invalid credentials'});
        }
        const token=jwt.sign({id:user.id},process.env.JWT_SECRET);
        res.status(200).json({success:true,message:'User logged in successfully',token});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const getUser=async (req,res)=>{
    try {
        const user=await User.findByPk(req.user.id);
        res.status(200).json({success:true,message:'User found',data:user});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


// export 
module.exports={
    register,
    login,
    getUser
}
