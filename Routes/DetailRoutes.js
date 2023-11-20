const express=require('express')
const { pool } = require('../Models/BasicModel')
const tDetails=express.Router()

tDetails.get("/getdetails",(req,res)=>{
    const [user_id]=req.body
    
    try{
        pool.query("SELECT * FROM teacherdetails WHERE user_id=?",[user_id],((error,results)=>{
            if(error){
                res.status(400).json({msg:error})
            }else{
                res.status(200).json({msg:results})
            }
        }))
    }catch(err){
        res.status(400).json({msg:err})
    }
})
tDetails.get("/teacherprofile",async(req,res)=>{
    const {user_id}=req.body
// console.log(user_id)
 
    try{

 const [results]=await pool.promise().query("SELECT * FROM teacherdetails WHERE user_id=?",[user_id])
    //   console.log(data)
      
        res.status(200).json({msg:results})
    }catch(err){
        res.status(400).json({msg:err})
    }
})

tDetails.post("/add", async (req, res) => {
    const { name, email, department, salary, gender, user_id } = req.body;
    // console.log(name, email, salary, gender, department, user_id);
const data=await pool.promise().query("SELECT * FROM teacherdetails WHERE user_id=?",[user_id])
if(data.length==0){
    try {
        const [results] = await pool.promise().query("SELECT * FROM teacherdetails");

        if (name && email && department && salary && gender && user_id) {
            try {
                const insertResult = await pool.promise().query(
                    "INSERT INTO teacherdetails (name, email, salary, gender, department, user_id) VALUES (?, ?, ?, ?, ?, ?)",
                    [name, email, salary, gender, department, +user_id]
                );

                console.log(insertResult);

                res.status(200).json({ msg: "Profile Created successfully" });
            } catch (err) {
                console.error(err);
                res.status(400).json({ msg: "Something went wrong with the database insertion" });
            }
        } else {
            res.status(400).json({ msg: "Please Provide All details" });
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({ msg: "Something went wrong with the database query" });
    }
}else{
    res.status(400).json({msg:"You Already Created Profile/You can edit.."})
}
   
});


   


module.exports={tDetails}