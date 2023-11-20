const express=require("express")
const { pool } = require("../Models/BasicModel")
const UserRouter=express.Router()

UserRouter.get("/data",(req,res)=>{
 const {limit,page}=req.query
const OFSET=(+page-1)*(+limit)

    
    try{
        
 pool.query (`SELECT * FROM teacher ${limit&&page&&"LIMIT ? OFFSET ?"}`, page&&limit&&[+limit,+OFSET],(error,results)=>{
    if(error){
        console.log(error)
        res.status(400).json({msg:error})
    }else{
        res.status(200).json(results)
    }
})
    }catch(err){
        console.log(err)
        res.status(400).json({msg:err})
    }})


UserRouter.post("/add",async(req,res)=>{
const {name,email,dept_id}=req.body
try{
pool.query('INSERT INTO teacher (name,email,dept_id) VALUES (?,?,?)',[name,email,dept_id],((error,results)=>{
if(error){
    res.status(400).json({msg:error})
}else{
    res.status(200).json({msg:results.affectedRows==1&&"TEACHER ADDED SUCCESSFULLY"})
}
}))

}catch(err){
    res.status(400).json({msg:err})
}
})
UserRouter.delete("/delete/:id",(req,res)=>{
    const {id}=req.params
    try{
pool.query('DELETE FROM teacher WHERE id=?',[id],((error,results)=>{
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
UserRouter.patch("/altertable",(req,res)=>{
    pool.query('ALTER TABLE teacher MODIFY COLUMN id INT AUTO_INCREMENT',((error,results)=>{
        if(error){
            res.status(400).json({msg:error})
        }else{
            res.status(200).json({msg:results})
        }
    }))
})
// UserRouter.post('')

module.exports={UserRouter}