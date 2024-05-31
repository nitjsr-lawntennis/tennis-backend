import express from 'express'
import { requireSignIn } from '../middleWares/authMiddleware.js';
import { createMatchController,
        deleteMatchController,
        getMatchesController, 
        getSingleMatchController, 
        latestMatchesController, 
        updateMatchController
    } from '../controllers/matchController.js';

const router = express.Router();

// creating match
router.post('/create-match',requireSignIn,createMatchController);

// fetching all matches
router.get('/get-matches/:id',getMatchesController)

//fetching single match
router.get('/get-single-match/:id',getSingleMatchController);

// updating match
router.put('/update-match/:id',requireSignIn,updateMatchController);

// delete match
router.delete('/delete-match/:id',deleteMatchController)

// latest updated matches
router.get('/get-updated-matches',latestMatchesController);

export default router