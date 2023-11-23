const express=require("express")
const { pool } = require("../Models/BasicModel")
const notesRouter=express.Router()
notesRouter.post("/createnotes",async(req,res)=>{
    const {user_id,title,description}=req.body

    if(title,description){

    
    try{
pool.query("INSERT INTO notes (title,description,user_id) VALUES(?,?,?)",[title,description,user_id],((error,results)=>{
    if(error){
        res.status(400).json({msg:error})
    }else{
        res.status(200).json({msg:"Note Created Successfully"})
    }
}))
    }catch(err){
        res.status(400).json({msg:"Error to create notes"})
    }}
    else{
        res.status(400).json({msg:"Please Provide All Required Details"})
    }
})

notesRouter.get("/getnotes",async(req,res)=>{

    const {user_id}=req.body
const {title,created_at,sortby,order,page,limit}=req.query
console.log("createdat",created_at)
console.log(title,"tiltle")
    
    let query=`SELECT * FROM notes WHERE user_id=${user_id} `
let queryvalue=[]
    if(title){
        const titlePattern = `%${title.split('').join('%')}%`;
        console.log(titlePattern)
                query+=`AND title LIKE ?`
                queryvalue.push(titlePattern)
    }
    if(created_at){
        query+=`AND created_at=?`+" "
        queryvalue.push(created_at)
    }
    if(sortby&&order){
        query+=`ORDER BY ${sortby} ${order} `+" "
    }
    if(page&&limit){
        let offset=(page-1)*limit
        query+=`LIMIT ${limit} OFFSET ${offset}`+" "
    }
    try{
        const [data] = await pool.promise().query(query,queryvalue);

res.status(200).json({msg:data})
    }catch(err){
        res.status(400).json({msg:err})
    }
    // req.status()
})
module.exports={notesRouter}