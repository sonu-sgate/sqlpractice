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



// getting notes data
notesRouter.get("/getnotes",async(req,res)=>{

    const {user_id}=req.body
const {title,created_at,sortby,order,page,limit}=req.query
// console.log("createdat",created_at)
// console.log(title,"tiltle")
    
    let query=`SELECT * FROM notes WHERE user_id=${user_id} `

let queryValues = [];

// Check for the existence of the title parameter
if (title) {
    const titlePattern = `%${title.split('').join('%')}%`;
    query += " AND title LIKE ?";
    queryValues.push(titlePattern);
}

// Check for the existence of the created_at parameter
if (created_at) {
    query += " AND created_at = ?";
    queryValues.push(created_at);
}

// Check for the existence of sortby and order parameters
if (sortby && order) {
    query += ` ORDER BY ${sortby} ${order}`;
}

// Check for the existence of page and limit parameters
if (page && limit) {
    let offset = (page - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;
}
// console.log(queryValues)
    if(limit&&page){
        console.log(queryValues,"queries valuess")
        if(queryValues.length>=1){
     
            try{
                const [alldata]=await pool.promise().query("SELECT COUNT(title) FROM notes WHERE user_id=?",[user_id])
             
         
                    const [data]=await pool.promise().query(query,queryValues)
                    // console.log(data)
                    res.status(200).json({msg:data,totalPages:Math.ceil(+(alldata[0]["COUNT(title)"])/limit)})
                
               
         
        
       
        }catch{
                res.status(400).json({msg:"something going wrong"})
            }
        }else{
            try{
                // console.log(queryValues,"else")
                const [alldata]=await pool.promise().query("SELECT COUNT(title) FROM notes WHERE user_id=?",[user_id])
             
         
                    const [data]=await pool.promise().query(query)
                    // console.log(data)
                    res.status(200).json({msg:data,totalPages:Math.ceil(+(alldata[0]["COUNT(title)"])/limit)})
                
               
         
        
       
        }catch(err){
            res.status(400).json({msg:"something going wrong"})
        }


        }
     
}else{
    // console.log(queryValues,"final")
    // console.log("query",query)
    try{

    
    if(queryValues.length>=1){
        const [data] = await pool.promise().query(query,queryValues);

        res.status(200).json({msg:data})
    }else{
        const [data]=await pool.promise().query(query)
        // console.log("querynew",query)
        res.status(200).json({msg:data})
    }}catch(err){
        res.status(400).json({msg:"Something going wrong"})
    }
   
}
    // req.status()
})
module.exports={notesRouter}