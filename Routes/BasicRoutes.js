const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require('../Models/BasicModel');
const jwt=require("jsonwebtoken");
const UserRouter = express.Router();

// *get request*
UserRouter.get('/data', async (req, res) => {
  try {
    const { limit, page, sortby, order } = req.query;
    const offset = (page - 1) * limit;
    let alldata = 0;

    const [countResult] = await pool.promise().query('SELECT COUNT(name) FROM teacher');
    alldata = countResult[0]['COUNT(name)'];

    let query = 'SELECT * FROM teacher';

    if (sortby && order) {
      query += ` ORDER BY ${sortby} ${order}`;
    }

    if (limit && page) {
      query += ` LIMIT ${+limit} OFFSET ${+offset}`;
    }

    const [results] = await pool.promise().query(query);
    res.status(200).json({ results, totalPages: limit && page && Math.ceil(alldata / +limit) });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: err });
  }
});


// *REgistration*
UserRouter.post('/register', async (req, res) => {
  const { name, email, dept_id, password } = req.body;

  if(email&&password){

 
  try {

    const [existingEmail] = await pool.promise().query('SELECT email FROM teacher WHERE email = ?', [email]);

    if (existingEmail.length > 0) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    await pool.promise().query('INSERT INTO teacher (name, email, dept_id, password) VALUES (?, ?, ?, ?)', [
      name,
      email,
      dept_id,
      hashedPassword,
    ]);

    res.status(200).json({ msg: 'TEACHER ADDED SUCCESSFULLY' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: err.message || 'Something went wrong' });
  } }else{
    res.status(400).json({msg:"Please provide the details"})
  }
});

// ************Login********************
UserRouter.post("/login",async(req,res)=>{
const {email,password}=req.body
// console.log(email,password)
const [userdata]=await pool.promise().query("SELECT * FROM teacher WHERE email=?",[email])
if(email&&password){


if(userdata.length>=1){
    try{
        bcrypt.compare(password, userdata[0].password, function(err, result) {
            // result == true
           if(result){
            var token = jwt.sign({ user_id:userdata[0].id ,dept_id:userdata[0].dept_id}, 'sgate');
            res.status(200).json({msg:"Login Successfully",usertoken:token,username:userdata[0].name,useremail:userdata[0].email,
        dept_id:userdata[0].dept_id})
           }else{
            res.status(400).json("Please Provide right Password")
           }
           
        });
        // const [data]=await pool.promise().query("SELECT ")
    }catch(err){
        res.status(400).json({msg:"User Is Not Registered"})
    }
}}
else{
    res.status(400).json({msg:"Please Provide Credentials"})
}

})

// *Delete*******************************

UserRouter.delete("/delete/:id",(req,res)=>{
    const {id}=req.params
    try{
pool.query('DELETE FROM teacher WHERE id=?',[id],((error,results)=>{
if(error){
    res.status(400).json({msg:error})
}else{
    res.status(200).json({msg:"DELETED SUCCESSFULLY"})
}
}))
    }catch(err){
        res.status(400).json({msg:err})
    }
})

// to add extra things
UserRouter.patch("/altertable",(req,res)=>{
    pool.query('ALTER TABLE teacher ADD COLUMN password VARCHAR(1000)',((error,results)=>{
        if(error){
            res.status(400).json({msg:error})
        }else{
            res.status(200).json({msg:"New Column ADDED"})
        }
    }))
})

UserRouter.patch("/alterdetailtable",(req,res)=>{
    pool.query(" ALTER TABLE teacherdetails  ADD CONSTRAINT fk_teacherdetails_teacher FOREIGN KEY (user_id) REFERENCES teacher(id) ON DELETE CASCADE",((error,results)=>{
if(error){
    res.status(400).json({msg:error})
}else{
    res.status(200).json({msg:results})
}
    }))

})
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// UserRouter.post('')
UserRouter.patch("/edit/:id",(req,res)=>{
    const {id}=req.params
    const {name}=req.body
    try{
        pool.query('UPDATE teacher SET name=? WHERE id=?',[name,id],((error,results)=>{
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
UserRouter.delete("/deleteuser/:id",async(req,res)=>{
const {id}=req.params
const [data]=await pool.promise().query('DELETE FROM teacher WHERE id=?',[id])

try{
    pool.query('DELETE FROM teacher WHERE id=?',[id],(error,results)=>{
        if(error){
            res.status(400).json({msg:error})
        }else{
            res.status(200).json({msg:"Deleted Successfully"})
        }
    })
}catch(err){
    res.status(400).json({msg:err})
}



})

module.exports={UserRouter}