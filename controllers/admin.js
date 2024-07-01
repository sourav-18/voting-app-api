const Election = require("../model/election");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../model/admin");

const handleAdminLogin = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(200).json({ message: "fill all data" });
    }
    const data = await Admin.findOne({ name });
    if(!data)
    return res.status(404).json({message:"Admin not Exist"})
    if (data) {
      bcrypt.compare(password, data.password, (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ message: "something worng try aganin later" });
        if (result) {
          var token = jwt.sign({ admin:data }, process.env.ADMIN_PRIVATEKEY);
          res
            .status(200)
            .json({ message: "admin successfuly login", jwt_token: token });
        }else {
            res.status(200).json({ message: "password is not correct" });
          }
      });
    }
  } catch (error) {
    console.log("error from handleLoginAdmin -> ", error);
    res.status(500).json({ message: "please try again later" });
  }
};
const handleNewElectionRegistration = async (req, res) => {
  try {
    const { name, description, type,periodOfTimeCandidateRegistration,periodOfTimeVoterRegistration,dateOfVotiong,resultDate } = req.body;
    console.log(req.body);
    if (!name || !description || !type)
      return res.status(400).json({ message: "fill the data correctly" });
    const respose = await Election.create({
      name,
      description,
      type,
      periodOfTimeCandidateRegistration,
      periodOfTimeVoterRegistration,
      dateOfVotiong,
      resultDate
    });
    //when i save the data in db in lastdateofrestrationSection why every time _id is pass that i dont't know
    res.status(201).json({ message: "ElectionRegistration successfuly" ,success:true});
  } catch (error) {
    console.log("error from electonRegistration ", err);
    return res
      .status(500)
      .json({ message: "something worng try aganin later" });
  }
};
const handleCalculateResult = async (req, res) => {
  try {
    const { _id } = req.params;
    const ElectionData = await Election.findById(_id);
    if (!ElectionData) {
      return res.status(404).json({ message: "Election not Found" });
    }
    if(ElectionData.resultCalculat){
      return res
      .status(200)
      .json({ message: "election result allready calculate" });
    }
    const { resultDate } = ElectionData;
    const today=new Date()
    const resDate=new Date(resultDate)
    if(today.getFullYear()===resDate.getFullYear()&&today.getMonth()===resDate.getMonth()&&today.getDate()===resDate.getDate()){
      let { candidate, result } = ElectionData;
      let WinCanidate = {},
        count = 0;
      for (const property in candidate) {
        let cp = candidate[property].totalGetVote;
        if (cp > count) {
          WinCanidate = candidate[property];
          count = cp;
        }
      }
      const finalResult = {
        isCalculate: true,
        candidate,
        totalVote: result.length,
        totalRegisterVoter: ElectionData.voter.length,
        totalRegisterCandidate: ElectionData.candidate.length,
        TotalunattemptedVoter: ElectionData.voter.length - result.length,
        WinCanidate,
      };
      //   console.log(finalResult)
      await Election.findByIdAndUpdate(_id, {
        $set: { finalResult, resultCalculat: true },
      });
      return res
        .status(200)
        .json({ message: "election result successfuly calculate ",success:true });
    }
      const rtdate = String(new Date(resultDate));
      return res
        .status(200)
        .json({ message: `Result Date On ${rtdate.substring(0, 15)} ` });
  } catch (error) {
    console.log("error from handleCalculateResult -> ", error);
    res.status(500).json({ message: "please try again later" });
  }
};
const showTodayResultElection=async(req,res)=>{
      try{
        const today=new Date();
        today.setHours(0,0,0,0)
        const endDay=new Date()
        endDay.setHours(23, 59, 59, 999);
        const data=await Election.find({resultDate: {
          $gte: today,
          $lte: endDay}}).select("candidate type description name _id ")
          return res.status(200).json({data})
      }catch(error){
        console.log("error from handleCalculateResult -> ", error);
        res.status(500).json({ message: "please try again later" });

      }
}
const handleAllRsult=async(req,res)=>{
  try{
    const data=await Election.find({resultCalculat:true}).select("candidate type description name _id ")
    res.status(200).json({data});
  }catch(error){
    console.log("error from handleAllRsult -> ", error);
    res.status(500).json({ message: "please try again later" });
  }
}
const handleResult=async(req,res)=>{
  try{
    const {_id}=req.body;
    if(!_id){
      return res.status(200).json({message:"fill the all data"})
    }
    const data=await Election.findById(_id).select("type description name _id finalResult")
    res.status(200).json({data});
  }catch(error){
    console.log("error from handleAllRsult -> ", error);
    res.status(500).json({ message: "please try again later" });
  }
}
const handleAllElection=async(req,res)=>{
  try{
    const data=await Election.find().select("type description name _id")
    res.status(200).json({data});
  }catch(error){
    console.log("error from handleAllRsult -> ", error);
    res.status(500).json({ message: "please try again later" });
  }
}
const handleElection=async(req,res)=>{
  try{
    const {_id}=req.body;
    if(!_id){
      return res.status(200).json({message:"fill the all data"})
    }
    const data=await Election.findById(_id)
    res.status(200).json({data});
  }catch(error){
    console.log("error from handleElection -> ", error);
    res.status(500).json({ message: "please try again later" });
  }
}
const handleDeleteElection=async(req,res)=>{
  try{
    const {_id}=req.params;
    if(!_id){
      return res.status(200).json({message:"fill the all data"})
    }
    const data = await Election.deleteOne({ _id });
    if(data.deletedCount){
      return res.status(200).json({message:"Election delete successfully "});
    }
    return res.status(404).json({message:"Election not found "});
  }catch{
    console.log("error from handleElection -> ", error);
    res.status(500).json({ message: "please try again later" });
  }
}
const handleUpdataElection=async(req,res)=>{
  try{
    const updatedata=req.body;
    console.log(req.body)
    const {_id}=req.params;
    if(!_id){
      return res.status(200).json({message:"fill the all data"})
    }
    const data = await Election.updateOne({ _id },{...updatedata,isEdit:true});
    // console.log(data)
      return res.status(200).json({message:"Election update successfully "});
  }catch(error){
    console.log("error from handleElection -> ", error);
    res.status(500).json({ message: "please try again later" });
  }
}
const handleShowEditedElection=async(req,res)=>{
    try{
      const data=await Election.find({isEdit:true}).select("type description name _id")
      res.status(200).json({data})
    }catch(error){
    console.log("error from handleShowEditedElection -> ", error);
    res.status(500).json({ message: "please try again later" });
  }
}
const handlePopulerElection=async(req,res)=>{
      try{
        const data=await Election.aggregate([
          {
            $project: {
              description: 1,
              name: 1,
              type: 1,
              resultCalculat: 1,
              resultDate: 1,
              dateOfVotiong: 1,
              sizeOfVoter: { $size: "$voter" },
              voterArray: "$voter"
            }
          },
          {
            $group: {
              _id: null,
              avgVoterSize: { $avg: "$sizeOfVoter" },
              allDocuments: { $push: "$$ROOT" }
            }
          },
          {
            $unwind: "$allDocuments"
          },
          {
            $match: {
              $expr: { $gt: ["$allDocuments.sizeOfVoter", "$avgVoterSize"] }
            }
          },
          {
            $replaceRoot: {
              newRoot: "$allDocuments"
            }
          },
          {
            $project: {
              description: 1,
              name: 1,
              type: 1,
              resultCalculat: 1,
              resultDate: 1,
              dateOfVotiong: 1,
            }
          },
          {
            $limit: 2 // Limit the output to 2 documents
          }

        ])
        res.status(200).json({data});
      }catch(error){
        console.log("error from handlePopulerElection -> ", error);
        res.status(500).json({ message: "please try again later" });
      }
}
const handleShowAdminProfile=async(req,res)=>{
  try{
    const data=await Election.aggregate([
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          resultCalculatTrueCount: {
            $sum: { $cond: { if: { $eq: ["$resultCalculat", true] }, then: 1, else: 0 } }
          }
        }
      }
    ])
    res.status(200).json({data});
  }catch(error){
        console.log("error from handleShowAdminProfile -> ", error);
        res.status(500).json({ message: "please try again later" });
      }
}
module.exports = {
  handleNewElectionRegistration,
  handleCalculateResult,
  handleAdminLogin,
  showTodayResultElection,
  handleAllRsult,
  handleResult,
  handleAllElection,
  handleElection,
  handleDeleteElection,
  handleUpdataElection,
  handleShowEditedElection,
  handlePopulerElection,
  handleShowAdminProfile,
};

// password hasing for admin
// const bcrypt = require("bcrypt");
// const bt=async()=>{
//     bcrypt.hash("admin", 10, async (err, hash) => {
//         console.log(hash)
//     })
// }
// bt()
