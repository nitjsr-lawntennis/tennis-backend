import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const connectDB = mongoose.connect(`${process.env.MONGO_CONNECTION_STRING}`)
                    .then(
                        console.log('You successfully connected to MongoDB!')
                    ).catch((error)=>{
                        console.log(error);
                    });
export default connectDB;