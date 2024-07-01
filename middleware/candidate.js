const jwt=require("jsonwebtoken");
const Candidate = require("../model/candidate");
const isvalidCandidate=async(req,res,next)=>{
    try{
        let token=req.headers.authorization;
        if(!token){
            return res.status(401).json({message:"Unauthorized access"})
        }
        token=token.split(" ")[1];
        jwt.verify(token,process.env.JWT_PRIVATEKEY,async (error,decode)=>{
          if(error){
            return res.status(401).json({message:"Unauthorized access"})
          }
          const candidate= await Candidate.findById(decode.candidate._id);
          if(!candidate){
            return res.status(401).json({message:"Unauthorized access"})
          }
          req.candidate=decode.candidate;
          next();
        })
    }catch(error){
        console.log("error from isvalidcandidate in middleware --> ", error);
        return res
        .status(500)
        .json({ message: "something worng try aganin later" });
    }
}
module.exports={isvalidCandidate};