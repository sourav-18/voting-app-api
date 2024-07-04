const express = require("express");
require("dotenv").config();
const app = express();
const voterRouter=require("./routes/voter")
const candidateRouter=require("./routes/candidate")
const electionRoute=require("./routes/election")
const adminRoute=require("./routes/admin")

// inbuild middleware
app.use(express.json())

// using Router
app.use("/voter",voterRouter)
app.use("/candidate",candidateRouter)
app.use("/election",electionRoute)
app.use('/admin',adminRoute);
app.get("/test",(req,res)=>{
  res.json({message:"server running"})
})
//mongodb connction
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("mongodb connecting Successfuly "))
  .catch((err) => console.log("error from mongdb Connction", err));
app.get('/',(req,res)=>res.json({success:"welcome"}))
//server listening
const PORT = process.env.PORT; 
app.listen(PORT, (err) => {
  if (err) {
    console.log("error from running server", err);
  } else {
    console.log("server running port ", PORT);
  }
});
