
const {Router}=require("express");
const { handleAddNewVoter, handleRegisterInElection, handleVoterLogin, handleVote, handleShowTodayVote } = require("../controllers/voter");
const { isvalidVoter } = require("../middleware/voter");
const { handleShowRegisterVote, handleUpcomingElection, handleShowVoterData, handleShowRegisterElection, handleShowUnattemptedVote, handleRemoveNameFromElection } = require("../controllers/infodisplay/voter");
const router=Router();
router.post("/signup",handleAddNewVoter);
router.post("/register",isvalidVoter, handleRegisterInElection);
router.post("/vote",isvalidVoter,handleVote );
router.post("/signin",handleVoterLogin);
router.get('/registervote',isvalidVoter,handleShowRegisterVote)
router.get('/upcomingelection',isvalidVoter,handleUpcomingElection)
router.get('/voterdetais',isvalidVoter,handleShowVoterData)
router.get('/unattemptedvote',isvalidVoter,handleShowUnattemptedVote)
router.put('/remove',isvalidVoter,handleRemoveNameFromElection)
// router.get('/showregisterelection',isvalidVoter,handleShowRegisterElection) this route will be use unattemvote and route name alsobechange
router.get('/todayvote',isvalidVoter,handleShowTodayVote)
module.exports=router