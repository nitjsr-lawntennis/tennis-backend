import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import userModel from '../models/userModel.js'
import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const registerController = async(req,res)=>{
    try {
        const {name,email,password,phone,answer,player} = req.body;
        //validations
        if(!name){
            return res.status(200).send({
                success:false,
                message:'Name is required'
            });
        }
        if(!email){
            return res.status(200).send({
                success:false,
                message:'Email is required'
            });
        }
        if(!password){
            return res.status(200).send({
                success:false,
                message:'Password is required'
            });
        }
        if(!phone){
            return res.status(200).send({
                success:false,
                message:'Phone is required'
            });
        }
        if(!answer){
            return res.status(200).send({
                success:false,
                message:'Answer is required'
            });
        }

        //checking for existing user
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:'User already registered. Please Login'
            });
        }
        const hashedPassword = await hashPassword(password);

        const user = await new userModel({
            name,
            email,
            phone,
            password:hashedPassword,
            answer,
            role:player
        }).save();
        res.status(200).send({
            success:true,
            message:"User registered successfully",
            user:{
                name,
                email,
                phone,
                answer
            }
        })
        
    } catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in registering user",
            error
        })
    }
}

export const loginController = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(200).send({
                success:false,
                message:'Invalid login credentials'
            });
        }
        // check for user
        const existingUser = await userModel.findOne({email});
        if(!existingUser){
            return res.status(200).send({
                success:false,
                message:"User doesn't exist",
            })
        }
        const correctPassword = await comparePassword(password,existingUser.password);
        console.log(correctPassword,password);
        if(!correctPassword){
            return res.status(200).send({
                success:false,
                message:"Invalid Password",
            })
        }
        const token = JWT.sign({_id:existingUser._id},process.env.JWT_SECRET_KEY,{expiresIn:'1d'});
        res.status(200).send({
            success:true,
            message:"Login successful",
            user:{
                name:existingUser.name,
                email:existingUser.email,
                phone:existingUser.phone,
                role:existingUser.role
            },
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in login",
            error
        })
    }
}

export const forgotPasswordContoller = async(req,res)=>{
    try {
        const {email,newPassword,answer} = req.body;
        if(!email){
            return res.send({message:'Email is required'});
        }
        if(!answer){
            return res.send({message:'Answer is required'});
        }
        if(!newPassword){
            return res.send({message:'New Password is required'});
        }
        //checking for user
        const existingUser = await userModel.findOne({email});
        if(!existingUser|| existingUser?.answer!=answer){
            return res.status(500).send({
                success:false,
                message:"Wrong email or answer",
            })
        }
        const hashedPassword = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(existingUser._id,{password:hashedPassword});
        res.status(200).send({
            success:true,
            message:'Password reset successfull',
            user:{
                name:existingUser.name,
                email:existingUser.email,
                phone:existingUser.phone,
                role:existingUser.role
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in forgot password api",
            error
        })
    }
}

export const updateProfileController = async(req,res)=>{
    try {
        const {name,email,phone,role} = req.body;
        //validations
        if(!name){
            return res.status(200).send({
                success:false,
                message:'Name is required'
            });
        }
        if(!email){
            return res.status(200).send({
                success:false,
                message:'Email is required'
            });
        }
        if(!phone){
            return res.status(200).send({
                success:false,
                message:'Phone is required'
            });
        }

        //checking for existing user
        const existingUser = await userModel.findOne({email});
        if(!existingUser){
            return res.status(200).send({
                success:false,
                message:"User doesn't exist"
            });
        }

        await userModel.findOneAndUpdate({email},{
            ...req.body
        },{new:true});
        res.status(200).send({
            success:true,
            message:"Profile update successful",
            user:{
                name,
                email,
                phone,
                role
            }
        })
        
    } catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in updating Profile",
            error
        })
    }
}

export const getAllUsers = async(req,res)=>{
    try {
        const users = await userModel.find({}).select("-password");
        res.status(200).send({
            success:true,
            message:"All Users fetched",
            users
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in fetching Users",
            error
        })
    }
}

export const getUser = async (req,res)=>{
    try {
        const user = await userModel.findById(req.params.id).select("-password -answer");
        res.status(200).send({
            success:true,
            message:"User Details fetched",
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in fetching User",
            error
        })
    }
}

export const deleteUserController = async (req,res)=>{
    try {
        await userModel.findByIdAndDelete(req.params.id);
        res.status(200).send({
            success:true,
            message:"User Deleted",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in deleting User",
            error
        })
    }
}

export const testController = async(req,res)=>{
    res.send({
        message:"Protected Route",
    })
}

