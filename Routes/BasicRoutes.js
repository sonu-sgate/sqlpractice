const express=require("express")
const { pool } = require("../Models/BasicModel")
const UserRouter=express.Router()

UserRouter.get("/data",async(req,res)=>{
 const {limit,page}=req.query
const OFSET=(+page-1)*(+limit)
let alldata=0
    pool.query("SELECT Count(name) FROM teacher",((error,results)=>{
        if(error){
            console.log(error)
        }else{
            // console.log(results)
           alldata=results[0]["Count(name)"]
        }
    }))
    try{
 pool.query (`SELECT * FROM teacher ${limit&&page&&"LIMIT ? OFFSET ?"}`, page&&limit&&[+limit,+OFSET],(error,results)=>{
    if(error){
        console.log(error)
        
        res.status(400).json({msg:error})
    }else{
console.log(alldata)
        res.status(200).json({results,[limit&&page&&"totalPages"]:Math.ceil((+alldata)/+limit)})
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

module.exports={UserRouter}