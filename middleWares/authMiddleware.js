import JWT from 'jsonwebtoken'
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';

//configuring dotenv
dotenv.config();

export const requireSignIn = async(req,res,next)=>{
    try {
        const {authorization} = req.headers;
        const decode = JWT.verify(authorization,process.env.JWT_SECRET_KEY);
        req.user = decode;
        next();
    } catch (error) {
        if (error instanceof JWT.TokenExpiredError) {
            return res.status(401).send({ 
                success:false,
                ok:false,
                message: "Please Login again" 
            });
        }
        return res.status(401).send({ 
            success:false,
            ok:false,
            message: "Please Login" 
        });
    }
}

export const isAdmin = async(req,res,next)=>{
    try {
        const id = req?.user._id;
        const admin = await userModel.findById(id);
        if(admin.role!==1){
            return res.status(401).send({
                success:false,
                ok:false,
                message: 'Unauthorized Access'
            })
        } else{
            next();
        }
    } catch (error) {
        console.log(error)
    }
}