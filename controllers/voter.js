const Voter = require("../model/voter");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { updateVoterAndElectionDetails } = require("../commonDataSave");
const Election = require("../model/election");
//addnewVoter in database
const handleAddNewVoter = async (req, res) => {
  try {
    const { name, email, phoneNumber, aadharNumber, password } = req.body;
    if (!name || !email || !phoneNumber || !aadharNumber || !password)
      return res.status(400).json({ message: "fill the data correctly" });
    const isExistVoter = await Voter.findOne({ aadharNumber });
    if (isExistVoter) {
      return res.status(403).json({ message: "voter allready exist" });
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        //console.log("error from password hashing ", err);
        return res
          .status(500)
          .json({ message: "something worng try aganin later" });
      }
      const voterdata = await Voter.create({
        name,
        email,
        phoneNumber,
        aadharNumber,
        password: hash,
      });
      //console.log(voterdata);
      return res.status(201).json({ message: "voter successfuly added",success:true });
    });
  } catch (error) {
    //console.log("error from handleAddVoter", error);
    return res
      .status(500)
      .json({ message: "something worng try aganin later" });
  }
};

//add voting information
const handleRegisterInElection = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { aadharNumber, _id, name } = req.voter;
    const { electionId, electionName } = req.body;
    if (!electionName || !electionId || !aadharNumber)
      return res.status(400).json({ message: "fill the data correctly" });

    const electionData = await Election.findById(electionId);
    if (!electionData) {
      return res.status(404).json({ message: "election is not find" });
    }
    //check already register or not
    const isAlreadyRegister = electionData.voter.find((data) => {
      return data.aadharNumber === aadharNumber;
    });
    if (isAlreadyRegister) {
      return res.status(200).json({ message: "you have already register " });
    }
    //check start registration date end or not
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const today = new Date(Date.now());
    const { endTime, startTime } = electionData.periodOfTimeVoterRegistration;
    if (today < startTime) {
      const time = new Date(startTime);
      return res.status(200).json({
        message: `Registration open post ${
          months[time.getMonth()]
        } ${time.getDate()}`,
      });
    }
    if (today > endTime) {
      return res.status(200).json({ message: "Registration close " });
    }

    await Voter.updateOne(
      { aadharNumber },
      { $push: { votingInfo: { electionName, electionId, time: today } } },
      session
    );
    await Election.findByIdAndUpdate(
      electionId,
      { $push: { voter: { aadharNumber, voterName: name, time: today } } },
      session
    );

    res
      .status(200)
      .json({ message: "voter successfuly register in voting election",success:true });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    //console.log("error from handleaddvotionInfo", error);
    return res
      .status(500)
      .json({ message: "something worng try aganin later" });
  } finally {
    session.endSession();
  }
};
// Login voter
const handleVoterLogin = async (req, res) => {
  try {
    const { aadharNumber, password } = req.body;
    if (!aadharNumber || !password)
      return res.status(400).json({ message: "fill the data correctly" });
    const voter = await Voter.findOne({ aadharNumber });
    if (!voter) {
      return res.status(404).json({ message: "voter not exist" });
    }
    bcrypt.compare(password, voter.password, (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "something worng try aganin later" });
      if (result) {
        var token = jwt.sign({ voter }, process.env.JWT_PRIVATEKEY);
        res
          .status(200)
          .json({ message: "voter successfuly login", jwt_token: token });
      } else {
        res.status(200).json({ message: "password is not correct" });
      }
    });
  } catch (error) {
    //console.log("error from voter loginHandler ", error);
    return res
      .status(500)
      .json({ message: "something worng try aganin later" });
  }
};
//handle vote
const handleVote = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { aadharNumber } = req.voter;
    const { candidateName, candidateAadharNumber, PartiesName,electionId } = req.body;
    if (
      !aadharNumber ||
      !candidateName ||
      !candidateAadharNumber ||
      !electionId
    )
      return res.status(400).json({ message: "fill the data correctly" });
    const ElectionDate = await Election.findById(electionId);
    const isvoterRegister = ElectionDate.voter.find((data) => {
      return data.aadharNumber === aadharNumber;
    });
    if (!isvoterRegister) {
      return res.status(200).json({ message: "Not registered, can't vote" });
    }
    if (isvoterRegister.isVoteDone)
      return res
        .status(200)
        .json({ message: "you have already done your valueable vote" });
    const today = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000);
    const { dateOfVotiong } = ElectionDate;
    const checkDateToVote = new Date(dateOfVotiong);
    // console.log({today,checkDateToVote})
    if (today < checkDateToVote) {
      res.status(200).json({
        message: `voting on ${checkDateToVote.getDate()} ${checkDateToVote.getMonth()} ${checkDateToVote.getFullYear()}`,
      });
    } else if (
      today.getFullYear() === checkDateToVote.getFullYear() &&
      today.getMonth() === checkDateToVote.getMonth() &&
      today.getDate() === checkDateToVote.getDate()
    ) {
      await Election.findOneAndUpdate(
        { _id: electionId, "voter.aadharNumber": aadharNumber },
        {
          $set:{ "voter.$.isVoteDone": true},
          $push: {
            result: {
              candidateName,
              candidateAadharNumber,
              voterAadharNumber: aadharNumber,
              time: today,
            },
          },
        },
        session
      );
      await Election.findOneAndUpdate(
        { 
          _id: electionId, 
          "candidate.aadharNumber": candidateAadharNumber 
        },
        {
          $inc: { "candidate.$.totalGetVote": 1 }, // Increment by 1
        },session
      );
      await Voter.findOneAndUpdate(
        { aadharNumber, "votingInfo.electionId": electionId },
        {
          $set: {
            "votingInfo.$.isVoteDone": true,
            "votingInfo.$.selection": { candidateName, PartiesName },
          },
        },
        session
      );
      res
        .status(200)
        .json({ message: `you have successfuly vote to ${PartiesName} (${candidateName}) `,success:true});
    } else {
      res.status(200).json({ message: " vote has expired" });
    }
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    //console.log("error from voter handlevote ", error);
    return res
      .status(500)
      .json({ message: "something worng try aganin later" });
  } finally {
    session.endSession();
  }
};
const handleShowTodayVote=async(req,res)=>{
  try{
    const today=new Date();
    today.setHours(0,0,0,0)
    const endDay=new Date()
    endDay.setHours(23, 59, 59, 999);
    const { aadharNumber } = req.voter;
    const data=await Election.find({dateOfVotiong: {
      $gte: today,
      $lte: endDay}}).where("voter.aadharNumber").equals(aadharNumber).select("candidate resultDate  type description name _id ")
      return res.status(200).json({data})
  }catch(error){
    //console.log("error from voter handleShowTodayVote ", error);
    return res
    .status(500)
    .json({ message: "something worng try aganin later" });
  }
}
module.exports = {
  handleAddNewVoter,
  handleRegisterInElection,
  handleVoterLogin,
  handleVote,
  handleShowTodayVote,
};
