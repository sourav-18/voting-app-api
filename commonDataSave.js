const mongoose = require("mongoose");
const Voter = require("./model/voter");
const Election = require("./model/election");

const updateVoterAndElectionDetails = async (updateData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const{aadharNumber,time,electionId,electionName,voterName}=updateData
    const updateVoter=await Voter.updateOne({ aadharNumbe }, { $push: { votingInfo: { electionName,electionId } } }, session);
  const updateElection=  await Election.findByIdAndUpdate(electionId , { $push: { voter: { aadharNumber,voterName,time } } }, session);
    await session.commitTransaction();
    console.log("Transaction committed successfully");
  } catch (err) {
    await session.abortTransaction();
    // console.error("Error from saving data: election and voter", err);
    return err;
  } finally {
    session.endSession();
  }
};

module.exports = { updateVoterAndElectionDetails };
