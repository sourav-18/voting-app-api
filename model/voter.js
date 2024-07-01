const mongoose=require("mongoose")
const voterSchema=new mongoose.Schema({
        name:{
            type:String,
            require:true,
        },
        email:{
            type:String,
            require:true,
        },
        phoneNumber:{
            type:String,
            require:true,
        },
        aadharNumber:{
            type:String,
            require:true,
            unique:true
        },
        password:{
            type:String,
            require:true
        },
        votingInfo:{
            type:[{electionName:String,electionId:String,time:Number,isVoteDone:{type:Boolean,default:false},selection:Object}],
        }
},{timestamps:true})
const Voter=mongoose.model("Voter",voterSchema);
module.exports=Voter;