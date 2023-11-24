const express=require('express')
const { pool } = require('../Models/BasicModel')
const tDetails=express.Router()
// to get **********profile*************method1*********
tDetails.get("/getdetails",(req,res)=>{
    const [user_id]=req.body
    // console.log(user_id)
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

// **********getprofile****************************
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

// Creating profile************************************
tDetails.post("/add", async (req, res) => {
    const { name, email, department, salary, gender, user_id,dept_id } = req.body;
    // console.log(name, email, salary, gender, department, user_id);
const [data]=await pool.promise().query("SELECT * FROM teacherdetails WHERE user_id=?",[user_id])
// console.log(data)
if(data.length==0){
    try {
        const [results] = await pool.promise().query("SELECT * FROM teacherdetails");

        if (name && email && department && salary && gender && user_id&&dept_id) {
            try {
                const insertResult = await pool.promise().query(
                    "INSERT INTO teacherdetails (name, email, salary, gender, department, user_id,dept_id) VALUES (?, ?, ?, ?, ?, ?,?)",
                    [name, email, salary, gender, department, +user_id,+dept_id]
                );

                // console.log(insertResult);

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

// editingroute
tDetails.patch("/edit/:id",async(req,res)=>{
    const {name,email,department,salary,dept_id,gender}=req.body
    const {user_id}=req.body
    const {id}=req.params
    let query='UPDATE teacherdetails SET '
    if(name){
        query+=`name='${name}'`+","+" "
        // res.status(200).json({msg:"done"})
    }''
    if(email){
        query+=`email='${email}'`+","+" "
    }
    if(department){
        query+=`department='${department}'`+","+" "
    }
    if(salary){
        query+=`salary='${+salary}'`+","+" "
    }
    if(dept_id){
        query+=`dept_id='${+dept_id}'`+","+" "
    }
    if(gender){
        query+=`gender='${gender}'`+" "
    }
 const [userdata]=await pool.promise().query("SELECT * FROM teacherdetails WHERE user_id=?",[user_id])
//  console.log(userdata)
// //  res.status(200).json({msg:userdata})
// console.log(userdata.user_id,user_id)
 if(userdata[0].user_id==user_id){

    pool.query(`${query} WHERE id=?`,[+id],(error,results)=>{
        if(error){
            
            res.status(400).json({msg:"Not able to edit ",error})
        }else{
            res.status(200).json({msg:"Edited Successfully"})
        }
    })
 }else{
    res.status(400).json({msg:"You are not authorized to do this "})
 }
})
   

// *Deleting Route***********************************


tDetails.delete("/deleteprofile/:id",async(req,res)=>{
    const {id}=req.params
    const {user_id}=req.body
    // console.log(user_id)
    const [data]=await pool.promise().query('SELECT * FROM teacherdetails WHERE id=? AND user_id=?',[id,user_id])
    // console.log(data)
    if(data.length>=1&&data[0].user_id==user_id){
        // const [userdata]=await pool.promise.query('DELETE FROM teacherdetails WHERE id=?',[id])
        try{
    pool.query("DELETE FROM teacherdetails WHERE id=?",[id],(error,results)=>{
        if(error){
            res.status(400).json({msg:"Error in deleting"})
        }else{
            res.status(200).json({msg:"Deleted Successfully"})
        }
    })
        }catch(err){
            res.status(400).json({msg:"Error in Deleting Profile"})
        }
    }else{
res.status(400).json({msg:"You are not authorized to do this.."})
    }
  
})

module.exports={tDetails}