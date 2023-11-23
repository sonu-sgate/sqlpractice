const express = require("express");
const cors = require("cors");
const { pool } = require("./Models/BasicModel");
const { UserRouter } = require("./Routes/BasicRoutes");
const { auth } = require("./Authentication/Auth");
const { tDetails } = require("./Routes/DetailRoutes");
const { notesRouter } = require("./Routes/Notes");

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.mysql = pool;
  // res.status(200).json({msg:pool})
  next();
});
app.get("/",(req,res)=>{
    res.status(200).json({msg:"Welcome to Backend"})
})
app.use("/teacher", UserRouter);
app.use("/profile", auth, tDetails);
app.use("/notes",auth,notesRouter)
app.listen(3000, async() => {
    try{
       pool.connect((error)=>{
            if(error){
                console.log(error)
            }else{
                console.log("connected to sql db")
            }
        })
    }catch(err){
        console.log(err)
    }
  console.log("server is running on port 3000");
});
