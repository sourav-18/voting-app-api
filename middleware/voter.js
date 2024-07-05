const jwt=require("jsonwebtoken");
const Voter = require("../model/voter");
const isvalidVoter=async(req,res,next)=>{
    try{
        let token=req.headers.authorization;
        if(!token){
            return res.status(401).json({message:"Unauthorized access"})
        }
        token=token.split(" ")[1];
        jwt.verify(token,process.env.JWT_PRIVATEKEY,async (error,decode)=>{
          // console.log("decode data--->" ,{error,decode}) if candidate token and voter token also docode make sure voter token anly pass
          if(error){
            return res.status(401).json({message:"Unauthorized access"})
          }
          const voter= await Voter.findById(decode.voter._id);
          if(!voter){
            return res.status(401).json({message:"Unauthorized access"})
          }
          req.voter=decode.voter;
          next();
        })
    }catch(error){
        //console.log("error from isvalidVoter in middleware --> ", error);
        return res
        .status(500)
        .json({ message: "something worng try aganin later" });
    }
}
module.exports={isvalidVoter};