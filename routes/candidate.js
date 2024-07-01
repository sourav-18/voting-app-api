const {Router}=require("express");
const { handleAddNewCandidate, handleAddVotingInfo, handleCandidateLogin, handleCandidateCurrentElection, handleShowRegisterElectionCandidate, handleLiveResult, handleWinElection, handleRemoveNameFromElection, handleShowCandidateData } = require("../controllers/candidate");
const { isvalidCandidate } = require("../middleware/candidate");
const router=Router();
router.post("/signup",handleAddNewCandidate);
router.post("/register",isvalidCandidate, handleAddVotingInfo);
router.post("/signin",handleCandidateLogin);
router.get("/currenelection",isvalidCandidate,handleCandidateCurrentElection);
router.get("/showregisterelection",isvalidCandidate,handleShowRegisterElectionCandidate);
router.get("/liveresult",isvalidCandidate,handleLiveResult);
router.get("/winelection",isvalidCandidate,handleWinElection);
router.put("/remove",isvalidCandidate,handleRemoveNameFromElection);
router.get('/candidatedetais',isvalidCandidate,handleShowCandidateData)
module.exports=router