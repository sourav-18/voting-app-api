const mongoose=require("mongoose")
const electionSchema=new mongoose.Schema({
        name:{
            type:String,
            require:true,
        },
        description:{
            type:String,
            require:true,
        },
        voter:{
            type:[{aadharNumber:String,voterName:String,time:Number,isVoteDone:{type:Boolean,default:false}}],
        },
        candidate:{
            type:[{aadharNumber:String,candidateName:String,partiesName:String,time:Number,totalGetVote:{type:Number,default:0}}],
        },
        type:{
            type:String,
            require:true
        },
        periodOfTimeCandidateRegistration:{
            type:{startTime:Date,endTime:Date},
            default:{startTime:Date.now(),endTime:Date.now()+(3 * 24 * 60 * 60 * 1000)} //rnge between date like 2fb to 5 feb
        },
        periodOfTimeVoterRegistration:{
            type:{startTime:Date,endTime:Date},
            default:{startTime:Date.now()+(3 * 24 * 60 * 60 * 1000),endTime:Date.now()+(7 * 24 * 60 * 60 * 1000)} //rnge between date like 5fb to 9 feb
        },
        dateOfVotiong:{
            type:Date,
            default:Date.now()+(10 * 24 * 60 * 60 * 1000)
        },
        result:{
            type:[{candidateName:String,candidateAadharNumber:String,voterAadharNumber:String,time:Number}]
        },
        resultDate:{
                type:Date,
                default:Date.now()+(12 * 24 * 60 * 60 * 1000)
        },
        finalResult:{
            type:{isCalculate:{type:Boolean,default:false},candidate:Object,totalVote:Number,totalRegisterVoter:Number,totalRegisterCandidate:Number,TotalunattemptedVoter:Number,WinCanidate:Object}
        },
        isEdit:{
            type:Boolean,
            default:false,
        },
        resultCalculat:{type:Boolean,default:false}
},{timestamps:true})
const Election=mongoose.model("Election",electionSchema);
module.exports=Election;