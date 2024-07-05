const jwt=require("jsonwebtoken");
const Admin = require("../model/admin");
const isvalidAdmin=async(req,res,next)=>{
    try{
        let token=req.headers.authorization;
        if(!token){
            return res.status(401).json({message:"Unauthorized access"})
        }
        token=token.split(" ")[1];
        jwt.verify(token,process.env.ADMIN_PRIVATEKEY,async (error,decode)=>{
          // console.log("decode data--->" ,{error,decode}) if candidate token and admin token also docode make sure admin token anly pass
          if(error){
            return res.status(401).json({message:"Unauthorized access"})
          }
          const admin= await Admin.findById(decode.admin._id);
          if(!admin){
            return res.status(401).json({message:"Unauthorized access"})
          }
          req.admin=decode.admin;
          next();
        })
    }catch(error){
       // console.log("error from isvalidadmin in middleware --> ", error);
        return res
        .status(500)
        .json({ message: "something worng try aganin later" });
    }
}
module.exports={isvalidAdmin};