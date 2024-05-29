import express from 'express'
import dotenv from 'dotenv'
import authRoutes from '../routes/authRoutes.js'
import tournamentRoutes from '../routes/tournamentRoutes.js'
import matchRoutes from '../routes/matchRoutes.js'
import connectDB from '../mogodb.js'
import morgan from 'morgan'
import cors from 'cors'

//configuring dotenv
dotenv.config();

//connecting dtabase
connectDB;

//starting express application
const app = express();

//middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// creating routes
app.use('/lawntennis/api/v1/auth',authRoutes);
app.use('/lawntennis/api/v1/tournament',tournamentRoutes);
app.use('/lawntennis/api/v1/matches',matchRoutes);
app.get('/',async (req,res)=>{
    res.status(200).send({
        message:"API WORKING!"
    })
});

// listen
const PORT = process.env.PORT||8000;
app.listen(PORT,()=>{
    console.log(`Lawn Tennis backend running on PORT ${PORT}`);
})