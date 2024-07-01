const {Router}=require("express");
const { handleAdminLogin, showTodayResultElection, handleAllRsult, handleResult, handleAllElection, handleElection, handleDeleteElection, handleUpdataElection, handleShowEditedElection, handlePopulerElection, handleShowAdminProfile } = require("../controllers/admin");
const { isvalidAdmin } = require("../middleware/admin");
const router=Router();
router.post("/signin",handleAdminLogin);
router.get("/toadyresultelection",isvalidAdmin,showTodayResultElection);
router.get("/allresult",isvalidAdmin,handleAllRsult);
router.post("/result",handleResult);
router.get("/allelection",isvalidAdmin,handleAllElection);
router.delete("/election/:_id",isvalidAdmin,handleDeleteElection);
router.put("/election/:_id",isvalidAdmin,handleUpdataElection);
router.get("/edited",isvalidAdmin,handleShowEditedElection);
router.post("/election",handleElection);  //show in details single election using _id so use post
router.get("/populer",handlePopulerElection);  
router.get("/profile",isvalidAdmin,handleShowAdminProfile);  

module.exports=router
