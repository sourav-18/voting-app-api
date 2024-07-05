const Candidate = require("../model/candidate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose=require("mongoose");
const Election = require("../model/election");
//addnewCandidate in database
const handleAddNewCandidate = async (req, res) => {
  try {
    //console.log("enter");
    const {
      name,
      email,
      phoneNumber,
      aadharNumber,
      password,
      aboutCandidate,
      partiesName,
    } = req.body;
    if (
      !name ||
      !email ||
      !phoneNumber ||
      !aadharNumber ||
      !password ||
      !aboutCandidate ||
      !partiesName
    )
      return res.status(400).json({ message: "fill the data correctly" });
    const isExistCandidate = await Candidate.findOne({ aadharNumber });
    if (isExistCandidate) {
      return res.status(403).json({ message: "Candidate allready exist" });
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        //console.log("error from password hashing candidate ", err);
        return res
          .status(500)
          .json({ message: "something worng try aganin later" });
      }
      const candidateData = await Candidate.create({
        name,
        email,
        phoneNumber,
        aadharNumber,
        partiesName,
        aboutCandidate,
        password: hash,
      });
      //console.log(candidateData);
      return res.status(201).json({ message: "Candidate successfuly added" ,success:true});
    });
  } catch (error) {
    //console.log("error from handleAddCandidate", error);
    return res
      .status(500)
      .json({ message: "something worng try aganin later" });
  }
};

//add voting information
const handleAddVotingInfo = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { aadharNumber, _id,name,partiesName } = req.candidate;
    const { electionId, electionName} = req.body;
    if (!electionName|| !electionId || !aadharNumber)
      return res.status(400).json({ message: "fill the data correctly" });

      const electionData=await Election.findById(electionId) 
      if(!electionData){
        return res.status(404).json({message:"election is not find"})
      }
     //check already register or not
     const isAlreadyRegister =electionData.candidate.find((data) => {
      return data.aadharNumber == aadharNumber;
    });
    if (isAlreadyRegister) {
      return res.status(200).json({ message: "you have already register " });
    }
    //check start registration date end or not
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const today=String(Date.now())
const {endTime,startTime}=electionData.periodOfTimeCandidateRegistration;
if(today<startTime){
  const time=new Date(startTime);
  return res.status(200).json({message:`Registration open post ${months[time.getMonth()]} ${time.getDate()}`})
}
if(today>endTime){
  return res.status(200).json({message:"Registration close "})
}

const time=Date.now()
  await Candidate.updateOne({ aadharNumber }, { $push: { votingInfo: { electionName,electionId ,time} } }, session);
   await Election.findByIdAndUpdate(electionId , { $push: { candidate: { aadharNumber,candidateName:name,time,partiesName } } }, session);

    res
      .status(200)
      .json({ message: "candidate successfuly register in election",success:true });
      await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    //console.log("error from handleaddCandidateInfo", error);
    return res
      .status(500)
      .json({ message: "something worng try aganin later" });
  }finally{
    session.endSession();
  }
};
// Login Candidate
const handleCandidateLogin = async (req, res) => {

  try {
    const { aadharNumber, password } = req.body;
    if (!aadharNumber || !password)
      return res.status(400).json({ message: "fill the data correctly" });
    const candidate = await Candidate.findOne({ aadharNumber });
    //console.log({aadharNumber})
    if (!candidate) {
      return res.status(400).json({ message: "candidate not exist" });
    }
    bcrypt.compare(password, candidate.password, (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "something worng try aganin later" });
      if (result) {
        var token = jwt.sign({ candidate }, process.env.JWT_PRIVATEKEY);
        res
          .status(200)
          .json({ message: "candidate successfuly login", jwt_token: token });
      } else {
        res.status(200).json({ message: "password is not correct" });
      }
    });
  }catch(error) {
    //console.log("error from candidateHandler login ",error)
    return res
    .status(500)
    .json({ message: "something worng try aganin later" });
  }
};
const handleCandidateCurrentElection=async (req,res)=>{
  try{
    const today=Date.now();
    const electionData=await Election.find().where("periodOfTimeCandidateRegistration.endTime").gt(today).select("candidate resultDate dateOfVotiong periodOfTimeCandidateRegistration type description name _id")
    res.status(200).json({electionData})
}catch(error){
    //console.log("error from handleCandidateCurrentElection -> ",error);
    res.status(500).json({message:"try again latter!"})
}

}
const handleShowRegisterElectionCandidate=async(req,res)=>{
  try{
      const {aadharNumber}=req.candidate;
      const data=await Election.find({ "candidate.aadharNumber": aadharNumber }).select("candidate resultDate type description name _id resultCalculat dateOfVotiong")
      res.status(200).json({data})
  }catch(error){
      //console.log("error from candidatae handleRegisterElection -> ",error);
      res.status(500).json({message:"try again latter!"})
  }
}
const handleLiveResult=async(req,res)=>{
  try{
    const today=new Date();
    today.setHours(0,0,0,0)
    const endDay=new Date()
    endDay.setHours(23, 59, 59, 999);
    const {aadharNumber}=req.candidate;
    const data=await Election.find({dateOfVotiong: {
      $gte: today,
      $lte: endDay}}).where("candidate.aadharNumber").equals(aadharNumber).select("candidate type description name _id ")
      return res.status(200).json({data})
}catch(error){
    //console.log("error from candidatae handleLiveResult -> ",error);
    res.status(500).json({message:"try again latter!"})
}
}
const handleWinElection=async(req,res)=>{
  try{
    const {aadharNumber}=req.candidate;
    const data=await Election.find(
      {
        resultCalculat: true,
        'finalResult.WinCanidate.aadharNumber': aadharNumber
      }).select("type description name _id ")
      res.status(200).json({data});
  }catch(error){
    //console.log("error from candidatae handleWinElection -> ",error);
    res.status(500).json({message:"try again latter!"})
  }
}
const handleRemoveNameFromElection=async(req,res)=>{
  try{
    const { aadharNumber } = req.candidate;
    const {_id}=req.body
    if(!_id){
      return res.status(200).json({message:"enter election _id"})
    }
  const data=await  Election.updateOne(   { _id },
  { $pull: { candidate: { aadharNumber } } })
  //console.log(data)
  const data2=await Candidate.updateOne({aadharNumber},{$pull:{votingInfo:{electionId:_id}}})
  if(data.acknowledged&&data.modifiedCount&&data2.acknowledged&&data2.modifiedCount){
    return res.status(200).json({message:"Successfully removed the name from the election"});
  }
  await session.commitTransaction();
  return res.status(404).json({message:"election not found"})

  }catch (error) {
      //console.log("error from  voter handleRemoveNameFromElection -> ", error);
      res.status(500).json({ message: "try again latter!" });
    }
}
const handleShowCandidateData = async (req, res) => {
  try {
    const { aadharNumber } = req.candidate;
    const data = await Candidate.findOne({ aadharNumber }).select(
      "votingInfo aadharNumber phoneNumber email name partiesName"
    );
    res.json({ data });
  } catch (error) {
    //console.log("error from handleShowCandidateData-> ", error);
    res.status(500).json({ message: "try again latter!" });
  }
};
module.exports = {
  handleAddNewCandidate,
  handleAddVotingInfo,
  handleCandidateLogin,
  handleCandidateCurrentElection,
  handleShowRegisterElectionCandidate,
  handleLiveResult,
  handleWinElection,
  handleRemoveNameFromElection,
  handleShowCandidateData
};
