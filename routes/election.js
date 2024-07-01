
const {Router}=require("express");
const { handleNewElectionRegistration, handleCalculateResult } = require("../controllers/admin");
const { isvalidAdmin } = require("../middleware/admin");

const router=Router();
router.post("/register", isvalidAdmin,handleNewElectionRegistration);
router.post("/calculatResult/:_id",handleCalculateResult);
module.exports=router