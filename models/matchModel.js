import mongoose from 'mongoose'

const matchSchema = new mongoose.Schema({
    tournament:{
        type:mongoose.ObjectId,
        ref:'tournaments'
    },
    teamA:{
        type:Object,
        teamName:{
            type:String,
            required:true
        },
        teamPlayers:{
            type:Array,
            required:true
        },
        required:true
    },
    teamB:{
        type:Object,
        teamName:{
            type:String,
            required:true
        },
        teamPlayers:{
            type:Array,
            required:true
        },
        required:true
    },
    scores:{
        type:Object,
        sets:{
            type:Array
        },
        setResult:{
            type:Array
        },
        default:{
            sets:[],
            setResult:[]
        }
    },
    matchDate:{
        type:String,
        required:true
    },
    matchResult:{
        type:String,
        default:"NA"
    },
},{timestamps:true})

export default mongoose.model('matches',matchSchema);