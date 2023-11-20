const express = require("express");
const cors = require("cors");
const { pool } = require("./Models/BasicModel");
const { UserRouter } = require("./Routes/BasicRoutes");
const { auth } = require("./Authentication/Auth");
const { tDetails } = require("./Routes/DetailRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.mysql = pool;
  // res.status(200).json({msg:pool})
  next();
});

app.use("/teacher", UserRouter);
app.use("/profile", auth, tDetails);
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
