import { dateCheck } from "../helpers/tournamentHelper.js";
import matchModel from "../models/matchModel.js";
import tournamentModel from "../models/tournamentModel.js";
import userModel from "../models/userModel.js";
import slugify from 'slugify'

// creating tournament
export const createTournamentController = async (req,res)=>{
    try {
        const {name,fromDate,toDate,venue} = req.body;
        if(!name||!fromDate||!toDate||!venue){
            return res.status(200).send({
                success:false,
                message:"Enter all the details"
            })
        }
        const organiser = req.user._id;
        // console.log(name,fromDate,toDate,venue,organiser);
        // Dates validation
        if(!await dateCheck(fromDate,toDate)){
            return res.status(200).send({
                success:false,
                message:"Specify correct from and to dates"
            })
        }
        const existing = await tournamentModel.findOne({name});
        if(existing){
            return res.status(200).send({
                success:false,
                message:"Please choose unique tournament name"
            })
        }
        const newTournament = await new tournamentModel({
            name,
            slug:slugify(name),
            fromDate,
            toDate,
            venue,
            organiser
        }).save();
        res.status(200).send({
            success:true,
            message:'New tournament created',
            newTournament
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while creating tournament",
            error
        })
    }
}

//deleting tournament
export const deleteTournamentContoller = async (req,res)=>{
    try {
        const user = await userModel.findById(req.user);
        const existing = await tournamentModel.findById(req.params.tid)
                                .select('organiser')
                                .populate('organiser')
                                .select("email");
        if(user.role===1||existing?.organiser?.email===user?.email){
            await tournamentModel.findByIdAndDelete(req.params.tid);
            await matchModel.deleteMany({tournament:req.params.tid});
            res.status(200).send({
                success:true,
                message:'Tournament deletion successful'
            })
        }else{
            res.status(401).send({
                success:false,
                message:'Unauthorized'
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while deleting tournament",
            error
        })
    }
}

// update tournament
export const updateTounamentController = async(req,res)=>{
    try {
        const {name,fromDate,toDate,venue}= req.body;
        //validation
        switch(true){
            case !name:
                return res.status(500).send({success:false,message:'Name is required'});
            case !fromDate||!toDate:
                return res.status(500).send({success:false,message:'Dates are required'});
            case !venue:
                return res.status(500).send({success:false,message:'Venue is required'});
        }
        if(!await dateCheck(fromDate,toDate)){
            return res.status(200).send({
                success:false,
                message:"Specify correct from and to dates"
            })
        }
        const user = await userModel.findById(req.user);
        const existing = await tournamentModel.findById(req.params.tid)
                                .select('organiser')
                                .populate('organiser')
                                .select("email");
        // console.log(existing.organiser.email,user.email)
        if(existing.organiser.email===user.email||user.role===1){
            await tournamentModel.findByIdAndUpdate(req.params.tid,{
                ...req.body
            },{new:true})
            res.status(200).send({
                success:true,
                message:'Tournament Update successful'
            })
        }else{
            res.status(200).send({
                success:false,
                message:'Unauthorized'
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while updating tournament",
            error
        })
    }
}

// get all tournaments
export const getTournamentsController = async (req,res)=>{
    try {
        const tournaments = await tournamentModel.find({}).populate("organiser","-password -answer");
        res.status(200).send({
            success:true,
            message:"tournaments fetched",
            tournaments
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while fetching tournaments",
            error
        })
    }
}

// get single tournament
export const getSingleTournamentController = async (req,res)=>{
    try {
        const tournament = await tournamentModel.findOne({slug:req.params.slug}).populate("organiser","-password -answer");
        res.status(200).send({
            success:true,
            message:"Tournament fetched",
            tournament
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while fetching tournaments",
            error
        })
    }
}

// get user tournaments
export const getUserTournamentsController = async (req,res)=>{
    try {
        const tournaments = await tournamentModel.find({organiser:req.user}).populate('organiser','-password -answer');
        res.status(200).send({
            success:true,
            message:'Tournaments fetched',
            tournaments
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in fetching tournaments",
            error
        })
    }
}

export const tournamentOrganiserContoller = async (req,res)=>{
    try {
        const user = await userModel.findById(req.user._id);
        const tournament = await tournamentModel.findOne({slug:req.params.slug}).select('organiser').populate('organiser', "_id")
        if(user.role===1 || tournament.organiser._id==req.user._id){
            res.status(200).send({
                success:true,
                message:"Authentication Successful",
                tournament:{
                    _id:tournament._id
                }
            })
        }else {
            res.status(200).send({
                success:false,
                message:"Unauthorized Access"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in verification',
            error
        })
    }
}
