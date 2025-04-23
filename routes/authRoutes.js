import express from 'express'
import { 
    deleteUserController,
    forgotPasswordContoller,
    getAllUsers,
    getUser,
    loginController,
    registerController,
    testController,
    updateProfileController
} from '../controllers/authController.js';
import { 
    isAdmin,
    requireSignIn
} from '../middleWares/authMiddleware.js';

const router = express.Router();

// register
router.post('/register',registerController);

//login
router.post('/login',loginController);

//forgot password
router.post('/forgot-password',forgotPasswordContoller)

//update profile
router.put('/update-profile',requireSignIn,updateProfileController)

// fetching all uers
router.get('/get-users',requireSignIn,isAdmin,getAllUsers)

// fetching single user
router.get('/get-user/:id',requireSignIn,isAdmin,getUser)

// delete user
router.delete('/delete-user/:id',requireSignIn,isAdmin,deleteUserController)

//testController 
router.post('/protected-route',requireSignIn,isAdmin,testController)

// auth
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});});

// verfiy token expiry
router.get('/verification',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true})
})

export default router