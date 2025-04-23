import { dateCheck } from "../helpers/tournamentHelper.js";
import matchModel from "../models/matchModel.js";
import tournamentModel from "../models/tournamentModel.js";

//create new match
export const createMatchController = async(req,res)=>{
    const {tournament,teamA,teamB,matchDate} = req.body;
    if(!matchDate){
        return res.status(200).send({
            success:false,
            message:"Match Date isn't specified"
        })
    }
    if(!tournament){
        return res.status(200).send({
            success:false,
            message:"Something went wrong"
        })
    }
    if(!teamA||!teamA?.teamName||teamA?.teamPlayers.length==0||!teamB||!teamB?.teamName||teamB?.teamPlayers.length==0){
        return res.status(200).send({
            success:false,
            message:"Something went wrong"
        })
    }
    try {
        const tournamentDetails = await tournamentModel.findById(tournament);
        if( !await dateCheck(tournamentDetails.fromDate,matchDate)|| !await dateCheck(matchDate,tournamentDetails.toDate)){
            return res.status(201).send({
                success:false,
                message:`Please select date between ${tournamentDetails.fromDate} & ${tournamentDetails.toDate}`
            })
        }
        const existing = await matchModel.findOne({tournament,teamA,teamB,matchDate});
        if(existing) {
            return res.status(201).send({
                success:false,
                message:"Match with same details exist"
            })
        }
        const match = await new matchModel({
            tournament,
            teamA,
            teamB,
            matchDate
        }).save();
        return res.status(200).send({
            success:true,
            message:"Match created",
            match
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error in creating matches",
            error
        })
    }
}

//get matches
export const getMatchesController = async(req,res)=>{
    try {
        const matches = await matchModel.find({tournament:req.params.id}).populate("tournament");
        res.status(200).send({
            success:true,
            message:"Matches Fetched",
            matches
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Something wend wrong in fetching matches",
            error
        })
    }
}

//get single match
export const getSingleMatchController = async (req,res)=>{
    try {
        const match = await matchModel.findById(req.params.id).populate("tournament");
        res.status(200).send({
            success:true,
            message:"Match Fetched",
            match
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Something wend wrong in fetching match",
            error
        })
    }
}

// update match
export const updateMatchController = async(req,res)=>{
    try {
        const {matchDate} = req.body;
        if(matchDate){
            const matchDetails = await matchModel.findById(req.params.id).populate('tournament');
            if( !await dateCheck(matchDetails.tournament.fromDate,matchDate)|| !await dateCheck(matchDate,matchDetails.tournament.toDate)){
                return res.status(201).send({
                    success:false,
                    message:`Please select date between ${matchDetails.tournament.fromDate} & ${matchDetails.tournament.toDate}`
                })
            }
        }
        const match = await matchModel.findByIdAndUpdate(req.params.id,{
            ...req.body
        },{new:true});
        res.status(200).send({
            success:true,
            message:"Match update successful",
            match
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Something wend wrong in fetching match",
            error
        })
    }
}

// delete controller
export const deleteMatchController = async (req,res)=>{
    try {
        const match = await matchModel.findByIdAndDelete(req.params.id);
        res.status(200).send({
            success:true,
            message:"Match Deleted",
            match
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Something wend wrong in fetching match",
            error
        })
    }
}

export const latestMatchesController = async (req,res)=>{
    try {
        const matches = await matchModel.find({}).populate("tournament").limit(6).sort({"updatedAt":-1});
        res.status(200).send({
            success:true,
            message:"Matches Fetched",
            matches
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Something wend wrong in fetching matches",
            error
        })
    }
}