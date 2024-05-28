import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true
    },
    fromDate:{
        type:String,
        required:true
    },
    toDate:{
        type:String,
        required:true
    },
    venue:{
        type:String,
        required:true
    },
    organiser:{
        type:mongoose.ObjectId,
        ref:'users'
    }
},{timestamps:true})

export default mongoose.model('tournaments',tournamentSchema);