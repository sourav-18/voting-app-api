const mongoose=require("mongoose")
const candidateSchema=new mongoose.Schema({
        name:{
            type:String,
            require:true,
        },
        email:{
            type:String,
            require:true,
            unique:true
        },
        phoneNumber:{
            type:String,
            require:true,
        },
        aadharNumber:{
            type:String,
            require:true
        },
        password:{
            type:String,
            require:true
        },
        aboutCandidate:{
            type:String,
            require:true,
        },
        partiesName:{
            type:String,
            require:true
        },
        votingInfo:{
            type:[{electionName:String,electionId:String,time:Number}],
        }
},{timestamps:true})
const Candidate=mongoose.model("Candidate",candidateSchema);
module.exports=Candidate;