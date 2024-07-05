const Election = require("../../model/election");
const Voter = require("../../model/voter");
const handleShowVoterData = async (req, res) => {
  try {
    const { aadharNumber } = req.voter;
    const data = await Voter.findOne({ aadharNumber }).select(
      "votingInfo aadharNumber phoneNumber email name"
    );
    res.json({ data });
  } catch (error) {
    //console.log("error from handleShowVoterData-> ", error);
    res.status(500).json({ message: "try again latter!" });
  }
};
const handleShowRegisterVote = async (req, res) => {
  try {
    const { aadharNumber } = req.voter;
    const RegisterVotingData = await Election.find({
      "voter.aadharNumber": aadharNumber,
    }).select(
      "_id name description type candidate resultCalculat resultDate dateOfVotiong"
    );
    res.status(200).json({ message: aadharNumber, data: RegisterVotingData });
  } catch (error) {
    //console.log("error from handleShowRegisterVote-> ", error);
    res.status(500).json({ message: "try again latter!" });
  }
};
const handleUpcomingElection = async (req, res) => {
  try {
    // const {aadharNumber}=req.voter;
    const today = Date.now();
    const electionData = await Election.find()
      .where("periodOfTimeVoterRegistration.endTime")
      .gt(today)
      .select(
        "candidate resultDate dateOfVotiong periodOfTimeVoterRegistration type description name _id"
      );
    res.status(200).json({ electionData });
  } catch (error) {
    //console.log("error from handleShowUpcomingElection -> ", error);
    res.status(500).json({ message: "try again latter!" });
  }
};
const handleShowRegisterElection = async (req, res) => {
  try {
    const { aadharNumber } = req.voter;
    let data = await Election.find({ "voter.aadharNumber": aadharNumber })
      .where({ "result.voterAadharNumber": { $ne: aadharNumber } })
      .select(
        "candidate resultDate dateOfVotiong type description name _id voter periodOfTimeVoterRegistration"
      );

    res.status(200).json({ data });
  } catch (error) {
    //console.log("error from  voter handleRegisterElection -> ", error);
    res.status(500).json({ message: "try again latter!" });
  }
};
const handleShowUnattemptedVote = async (req,res) => {
  try {

    const { aadharNumber } = req.voter;
    const currentDate = new Date(); // Today's date
    currentDate.setHours(0, 0, 0, 0); 
    const data = await Election.find({
      voter: {
        $elemMatch: {
          aadharNumber,
          isVoteDone: false,
        },
      },
      dateOfVotiong: { $lt: currentDate }, // Compare dateOfVotiong with today's date
    }).select(
        "candidate resultDate dateOfVotiong type description name _id voter periodOfTimeVoterRegistration"
      );
    res.status(200).json({ data });
  } catch (error) {
    //console.log("error from  voter handleRegisterElection -> ", error);
    res.status(500).json({ message: "try again latter!" });
  }
};
const handleRemoveNameFromElection=async(req,res)=>{
  try{
    const { aadharNumber } = req.voter;
    const {_id}=req.body
    if(!_id){
      return res.status(200).json({message:"enter election _id"})
    }
  const data=await  Election.updateOne(   { _id },
  { $pull: { voter: { aadharNumber } } })
  //console.log(data)
  const data2=await Voter.updateOne({aadharNumber},{$pull:{votingInfo:{electionId:_id}}})
  if(data.acknowledged&&data.modifiedCount&&data2.acknowledged&&data2.modifiedCount){
    return res.status(200).json({message:"Successfully removed the name from the election"});
  }
  return res.status(404).json({message:"election not found"})
  }catch (error) {
      //console.log("error from  voter handleRemoveNameFromElection -> ", error);
      res.status(500).json({ message: "try again latter!" });
    }
}
module.exports = {
  handleShowRegisterVote,
  handleUpcomingElection,
  handleShowVoterData,
  handleShowRegisterElection,
  handleShowUnattemptedVote,
  handleRemoveNameFromElection,
};
// {
//     name:"sourav",
//     arr:[{hoby:"done",is:flase},{hoby:"os",is:true}]
// }
