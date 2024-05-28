import express from 'express'
import { requireSignIn } from '../middleWares/authMiddleware.js';
import {
    createTournamentController,
    deleteTournamentContoller,
    getSingleTournamentController,
    getTournamentsController,
    getUserTournamentsController,
    tournamentOrganiserContoller,
    updateTounamentController
} from '../controllers/tournamentController.js'

const router = express.Router();

// create tournament
router.post('/create-tournament',requireSignIn,createTournamentController);

//delete tournament
router.delete('/delete-tournament/:tid',requireSignIn,deleteTournamentContoller);

//update tournament
router.put('/update-tournament/:tid',requireSignIn,updateTounamentController)

//get all tournaments
router.get('/get-tournaments',getTournamentsController)

// get single tournament
router.get('/get-tournament/:slug',getSingleTournamentController);

//get user tournaments
router.get('/get-user-tournaments',requireSignIn,getUserTournamentsController);

router.get('/verify-tournament-organiser/:slug',requireSignIn,tournamentOrganiserContoller)

export default router